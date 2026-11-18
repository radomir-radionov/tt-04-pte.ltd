import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import type { ProfileDto } from './profile.types';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  getProfile(): Promise<ProfileDto> {
    return this.profileRepository.getDefaultProfile();
  }
}