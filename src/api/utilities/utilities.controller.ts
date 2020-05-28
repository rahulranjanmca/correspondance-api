import { Controller, Get, Injectable } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UtilitiesService } from './utilities.service';

@ApiTags('utilities')
@Controller('api-health')
@Injectable()
export class UtilitiesController {
  private readonly utilitiesService: UtilitiesService = new UtilitiesService();

  @Get()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getHealth(): string {
    return this.utilitiesService.getHealth();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Get('stringifyEnv')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getStringifyEnv() {
    try {
      return this.utilitiesService.stringifyEnv();
    } catch (error) {
      throw error;
    }
  }
}
