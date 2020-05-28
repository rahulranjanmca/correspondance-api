/**
 * the controller for Templates api
 */
import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { WmCccErrorDto } from '../common/dto/error.dto';
import { TemplateFormQueryDto } from './dto/template.form.query.dto';
import { TemplateFormResponseDto } from './dto/template.form.response.dto';
import { TemplateLetterQueryDto } from './dto/template.letter.query.dto';
import { TemplateLetterResponseDto } from './dto/template.letter.response.dto';
import { TemplateResponseDto } from './dto/template.response.dto';
import { TemplatesService } from './templates.service';

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
  private readonly templatesService: TemplatesService;
  constructor(templatesService: TemplatesService) {
    this.templatesService = templatesService;
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Retrieves the available letters',
    description: 'Retrieves the available letters templates in the system. This delegates the call to Document API.'
  })
  @ApiResponse({ status: 200, type: [TemplateResponseDto], description: 'Response that returns an array of templates.' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get('/letters')
  async getLetters(@Query() query: TemplateLetterQueryDto): Promise<TemplateLetterResponseDto[]> {
    return await this.templatesService.getLetterCatalog(query);
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Retrieves the available forms',
    description: 'Retrieves the available forms templates in the system. This delegates the call to Document API.'
  })
  @ApiResponse({ status: 200, type: [TemplateResponseDto], description: 'Response that returns an array of templates.' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get('/forms')
  async getForms(@Query() query: TemplateFormQueryDto): Promise<TemplateFormResponseDto[]> {
    return await this.templatesService.getFormCatalog(query);
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Retrieves the template descriptions',
    description:
      'Retrieves the Template Description for the given template id, which is basically a JSON Forms object to allow the frontend to render the form for the template fields.'
  })
  @ApiResponse({ status: 200, type: Object, description: 'Response that returns an array of templates.' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get('/templateDescriptions/:id')
  async getTemplateDescriptionsById(@Param('id') id: string): Promise<Record<string, string>> {
    return await this.templatesService.getTemplateById(id);
  }
}
