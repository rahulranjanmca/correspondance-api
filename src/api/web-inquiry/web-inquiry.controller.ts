import { Body, Controller, Get, HttpCode, Param, Put, Req, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonService } from '../common/common.service';
import { WmCccErrorDto } from '../common/dto/error.dto';
import { ErrorFilter } from '../common/filter/error.filter';
import { Payload } from '../common/interface/payload.interface';
import { WebInquiryResponseFields } from './dto/web-inquiry.contact.status.detail.dto copy';
import { WebInquiryDetailDto } from './dto/web-inquiry.detail.dto';

@ApiTags('Web Inquiry/Ask A Question')
@UseFilters(ErrorFilter)
@Controller('web-inquiry')
export class WebInquiryController {
  private readonly commonService: CommonService;
  constructor(commonService: CommonService) {
    this.commonService = commonService;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @ApiOperation({
    summary: 'Retrieve details of a particular Question (Correspondence) ID',
    description:
      'Retrieve details of a current correspondence.  This is a Facade method that delegates to Contact API.  It will call the Contact API with getParentInquiries=true to retrieve the entire correspondence xref history.'
  })
  @ApiResponse({ status: 200, type: [WebInquiryDetailDto], description: 'Response that provides the details of a WebResponse' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 401, type: WmCccErrorDto, description: 'Unauthorized - Token is missing or Invalid token' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get(':webInquiryId')
  async getById(@Param('webInquiryId') id: string, @Req() request: { user: Payload }): Promise<WebInquiryDetailDto[]> {
    return await this.commonService.sendWebInquiryGet(id, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiOperation({
    summary: 'Add a new response to the web inquiry.',
    description: 'Provides a new response to the current thread in the web inquiry.'
  })
  @ApiResponse({
    status: 201,
    type: [WebInquiryDetailDto],
    description: 'The operation completed successfully but no content is needed in the response.'
  })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 401, type: WmCccErrorDto, description: 'Unauthorized - Token is missing or Invalid token' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Put(':webInquiryId')
  async update(
    @Param('webInquiryId') id: string,
    @Body() body: WebInquiryResponseFields,
    @Req() request: { user: Payload }
  ): Promise<void> {
    return await this.commonService.sendWebInquiryPatch(id, body, request.user);
  }
}
