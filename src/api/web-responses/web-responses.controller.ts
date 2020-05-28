/*
 * WebResponsesController
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CommonService } from '../common/common.service';
import { WmCccErrorDto } from '../common/dto/error.dto';
import { ErrorFilter } from '../common/filter/error.filter';
import { Payload } from '../common/interface/payload.interface';
import { CsWebResponseDetail } from './dto/web-responses.detail.dto';
import { CsWebResponseDetailFields } from './dto/web-responses.detail.fields';
import { WebResponsesGetQueryDto } from './dto/web-responses.get.query.dto';
import { CsWebResponseSummaryDto } from './dto/web-responses.response.summary.dto';
import { WebResponsesService } from './web-responses.service';

@ApiTags('Web Responses')
@Controller('webResponses')
@UseFilters(ErrorFilter)
export class WebResponsesController {
  private readonly webResponsesService: WebResponsesService;

  constructor(webResponsesService: WebResponsesService) {
    this.webResponsesService = webResponsesService;
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Retrieves the available web responses',
    description:
      'Retrieves the available web responses in the system. Filtering is possible to narrow the list. Pagination is also supported.'
  })
  @ApiResponse({ status: 200, type: [CsWebResponseSummaryDto], description: 'Response that provides the details of a WebResponse' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get()
  async get(@Query() query: WebResponsesGetQueryDto, @Res() response: Response): Promise<void> {
    const ret = await this.webResponsesService.get(query);
    response
      .set('X-Page', ret.page.toString())
      .set('X-Per-Page', ret.perPage.toString())
      .set('X-Next-Page', ret.nextPage.toString())
      .set('X-Prev-Page', ret.prevPage.toString())
      .set('X-Total-Pages', ret.totalPages.toString())
      .set('X-Total', ret.total.toString())
      .send(ret.data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a new web response',
    description: 'Creates a new web response. This operation should only be available to admins of the system.'
  })
  @ApiResponse({ status: 200, type: CsWebResponseDetail, description: 'Response that provides the details of a WebResponse.' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 401, type: WmCccErrorDto, description: 'Unauthorized - Token is missing or Invalid token' })
  @ApiResponse({ status: 403, type: WmCccErrorDto, description: 'Forbidden - Not allowed to perform the action' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post()
  async create(@Body() body: CsWebResponseDetailFields, @Req() request: { user: Payload }): Promise<CsWebResponseDetail> {
    this.checkOrThrow(request.user);

    return await this.webResponsesService.create(body, request.user.userId);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieves the detailed content for the given web response' })
  @ApiResponse({ status: 200, type: CsWebResponseDetail, description: 'Response that provides the details of a WebResponse' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get(':webResponseId')
  async getById(@Param('webResponseId') id: string): Promise<CsWebResponseDetail> {
    return await this.webResponsesService.getById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @ApiOperation({ summary: 'Update the detailed content for the given web response.' })
  @ApiResponse({ status: 200, type: CsWebResponseDetail, description: 'Response that provides the details of a WebResponse' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 401, type: WmCccErrorDto, description: 'Unauthorized - Token is missing or Invalid token' })
  @ApiResponse({ status: 403, type: WmCccErrorDto, description: 'Forbidden - Not allowed to perform the action' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Patch(':webResponseId')
  async updateById(
    @Param('webResponseId') id: string,
    @Body() body: CsWebResponseDetailFields,
    @Req() request: { user: Payload }
  ): Promise<CsWebResponseDetail> {
    this.checkOrThrow(request.user);

    return await this.webResponsesService.updateById(id, body, request.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deletes the specified web response.',
    description: 'Deletes the specified web response. This operation should only be available to admins of the system.'
  })
  @ApiResponse({ status: 204, description: 'The operation completed successfully but no content is needed in the response' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 401, type: WmCccErrorDto, description: 'Unauthorized - Token is missing or Invalid token' })
  @ApiResponse({ status: 403, type: WmCccErrorDto, description: 'Forbidden - Not allowed to perform the action' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Delete(':webResponseId')
  async deleteById(@Param('webResponseId') id: string, @Req() request: { user: Payload }): Promise<void> {
    this.checkOrThrow(request.user);

    return await this.webResponsesService.deleteById(id);
  }

  /**
   * check if allow admin actions
   * @param payload including user role
   */
  private checkOrThrow(payload: Payload): void {
    if (payload.userRole !== 'admin') {
      throw CommonService.getHttpError('Not allowed to perform the action', HttpStatus.FORBIDDEN);
    }
  }
}
