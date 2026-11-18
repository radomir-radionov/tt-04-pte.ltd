#!/usr/bin/env node
/**
 * Provision Render Postgres + Docker web service for tt-04-pte.ltd
 * Usage: RENDER_API_KEY=rnd_... node scripts/render-deploy.mjs
 */
const API = 'https://api.render.com/v1';
const REPO = 'https://github.com/radomir-radionov/tt-04-pte.ltd';
const BRANCH = 'main';
const DB_NAME = 'tt-04-digital-card-db';
const WEB_NAME = 'tt-04-digital-card';

const key = process.env.RENDER_API_KEY?.trim();
if (!key) {
  console.error('Set RENDER_API_KEY (Account Settings → API Keys on Render).');
  process.exit(1);
}

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  }
  return data;
}

function unwrap(row) {
  return row?.service ?? row?.postgres ?? row?.owner ?? row;
}

async function main() {
  const owners = await api('GET', '/owners?limit=20');
  const owner = unwrap(owners[0]);
  const ownerId = owner?.id;
  if (!ownerId) {
    throw new Error('No Render workspace found for this API key.');
  }
  console.log(`Workspace: ${owner?.name ?? ownerId}`);

  const services = await api('GET', `/services?ownerId=${ownerId}&limit=100`);
  const existingWeb = services.find((row) => unwrap(row)?.name === WEB_NAME);
  const databases = await api('GET', `/postgres?ownerId=${ownerId}&limit=100`);
  const existingDb = databases.find((row) => unwrap(row)?.name === DB_NAME);

  let db = existingDb ? unwrap(existingDb) : null;
  if (!db) {
    console.log('Creating Postgres…');
    const created = await api('POST', '/postgres', {
      name: DB_NAME,
      ownerId,
      plan: 'free',
      version: '16',
      databaseName: 'digital_card',
      databaseUser: 'digital_card',
    });
    db = unwrap(created);
  } else {
    console.log('Postgres already exists.');
  }

  const connectionInfo = await api(
    'GET',
    `/postgres/${db.id}/connection-info`,
  );
  const databaseUrl =
    connectionInfo?.connectionString ??
    connectionInfo?.externalConnectionString ??
    connectionInfo?.internalConnectionString;
  if (!databaseUrl) {
    throw new Error('Could not read internal DATABASE_URL from Render API.');
  }

  let web = existingWeb ? unwrap(existingWeb) : null;
  if (!web) {
    console.log('Creating web service…');
    const created = await api('POST', '/services', {
      type: 'web_service',
      name: WEB_NAME,
      ownerId,
      repo: REPO,
      branch: BRANCH,
      autoDeploy: 'yes',
      autoDeployTrigger: 'commit',
      serviceDetails: {
        runtime: 'docker',
        plan: 'free',
        healthCheckPath: '/health',
        envSpecificDetails: {
          dockerfilePath: './Dockerfile',
          dockerContext: '.',
        },
      },
      envVars: [
        { key: 'DATABASE_URL', value: databaseUrl },
        { key: 'NODE_ENV', value: 'production' },
      ],
    });
    web = unwrap(created);
  } else {
    console.log('Web service already exists.');
    await api('PUT', `/services/${web.id}/env-vars`, {
      envVars: [
        { key: 'DATABASE_URL', value: databaseUrl },
        { key: 'NODE_ENV', value: 'production' },
      ],
    });
    await api('POST', `/services/${web.id}/deploys`, { clearCache: 'do_not_clear' });
  }

  const url =
    web.serviceDetails?.url ??
    `https://${WEB_NAME}.onrender.com`;

  console.log('\n--- Done ---');
  console.log(`GraphQL: ${url}/graphql`);
  console.log(`Health:  ${url}/health`);
  console.log('First deploy can take 10–20 minutes on the free tier.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});