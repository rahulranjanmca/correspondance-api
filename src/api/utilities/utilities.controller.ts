import { Controller, Get, Injectable } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { HealthDto } from './dto/health.dto';
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
  getHealth(): HealthDto {
    return this.utilitiesService.getHealth();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Get('stringifyEnv')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getStringifyEnv() {
    try {
      return await this.utilitiesService.stringifyEnv();
    } catch (error) {
      throw error;
    }
  }
}
