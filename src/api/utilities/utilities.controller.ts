import { Controller, Get, Injectable } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UtilitiesService } from './utilities.service';

@ApiTags('utilities')
@Controller('api-health')
@Injectable()
export class UtilitiesController {
  private readonly utilitiesService: UtilitiesService;
  constructor(utilitiesService: UtilitiesService) {
    this.utilitiesService = utilitiesService;
  }

  @Get()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getHealth(): Record<string, string> {
    return this.utilitiesService.getHealth();
  }

  @Get('stringifyEnv')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getStringifyEnv(): Promise<string[]> {
    try {
      return this.utilitiesService.stringifyEnv();
    } catch (error) {
      throw error;
    }
  }
}
