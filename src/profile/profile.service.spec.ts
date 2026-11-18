import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  const repository = {
    getDefaultProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: ProfileRepository, useValue: repository },
      ],
    }).compile();

    service = module.get(ProfileService);
    jest.clearAllMocks();
  });

  it('getProfile delegates to repository', async () => {
    const expected = {
      id: '1',
      name: 'Radomir Radionov',
      description: 'desc',
      links: [],
      skills: [],
      experiences: [],
      projects: [],
    };
    repository.getDefaultProfile.mockResolvedValue(expected);

    await expect(service.getProfile()).resolves.toBe(expected);
    expect(repository.getDefaultProfile).toHaveBeenCalledTimes(1);
  });
});