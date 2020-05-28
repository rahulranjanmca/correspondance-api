/**
 * the controller for Conversations api
 */

import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Duplex } from 'stream';
import { v4 as uuid } from 'uuid';

import logger from '../../lib/logger';
import { CommonService } from '../common/common.service';
import { UserAndRoleCommonQuery } from '../common/dto/common.query.dto';
import { WmCccErrorDto } from '../common/dto/error.dto';
import { ConversationsService } from './conversations.service';
import { ConversationCreateRequest } from './dto/conversation.create.request.dto';
import { ConversationDownloadQueryDto } from './dto/conversation.download.query.dto';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationGetCaseQueryDto } from './dto/conversation.get.case.query.dto';
import { ConversationPreviewRequestDto } from './dto/conversation.preview.request.dto';
import { ConversationUpdateBodyDto } from './dto/conversation.update.body.dto';
import { ReasonBodyDto } from './dto/reason.body.dto';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationsController {
  private readonly conversationService: ConversationsService;
  private readonly commonService: CommonService;
  constructor(conversationService: ConversationsService, commonService: CommonService) {
    this.conversationService = conversationService;
    this.commonService = commonService;
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieves the conversation with the provided case id.' })
  @ApiResponse({ status: 200, type: ConversationDto, description: 'Response that returns a Conversation' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get()
  async getByCaseId(@Query() query: ConversationGetCaseQueryDto): Promise<ConversationDto> {
    try {
      return await this.conversationService.findByCaseId(query.caseId, query);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`get conversation by caseid ${query.caseId}`, query.userId, query.role, error);
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieves the conversation with the provided id.' })
  @ApiResponse({ status: 200, type: ConversationDto, description: 'Response that returns a Conversation' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get(':id')
  async getById(@Query() query: UserAndRoleCommonQuery, @Param('id') id: string): Promise<ConversationDto> {
    try {
      return await this.conversationService.findById(id, query);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`get conversation by ${id}`, query.userId, query.role, error);
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'A conversation is the name for the process of creating a new correspondence from a letter or form.' })
  @ApiResponse({ status: 200, type: ConversationDto, description: 'Response that returns a Conversation' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post()
  async create(@Query() query: UserAndRoleCommonQuery, @Body() body: ConversationCreateRequest): Promise<ConversationDto> {
    try {
      return await this.conversationService.createConversation(query, body);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`create conversation`, query.userId, query.role, error);
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Update the conversation with given id' })
  @ApiResponse({ status: 200, type: ConversationDto, description: 'Response that returns a Conversation' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Query() query: UserAndRoleCommonQuery,
    @Body() body: ConversationUpdateBodyDto
  ): Promise<ConversationDto> {
    try {
      return await this.conversationService.updateConversation(id, query, body);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`update conversation ${id}`, query.userId, query.role, error);
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Update the conversation with given id' })
  @ApiResponse({ status: 200, type: ConversationDto, description: 'Response that returns a Conversation' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post(':id/approve')
  async approve(@Param('id') id: string, @Query() query: UserAndRoleCommonQuery, @Body() body: ReasonBodyDto): Promise<ConversationDto> {
    try {
      return await this.conversationService.approve(id, body.reason, query);
    } catch (error) {
      try {
        throw await this.commonService.saveErrorAuditRecord(`approve conversation ${id}`, query.userId, query.role, error);
      } catch (error) {
        logger.error(error);
        throw error;
      }
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Approve current approval step.' })
  @ApiResponse({ status: 200, type: ConversationDto, description: 'Response that returns a Conversation' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post(':id/reject')
  async reject(@Param('id') id: string, @Query() query: UserAndRoleCommonQuery, @Body() body: ReasonBodyDto): Promise<ConversationDto> {
    try {
      return await this.conversationService.reject(id, body.reason, query);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`reject conversation ${id}`, query.userId, query.role, error);
    }
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Approve current approval step.' })
  @ApiResponse({ status: 204, description: 'The operation completed successfully but no content is needed in the response.' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Query() query: UserAndRoleCommonQuery): Promise<ConversationDto> {
    try {
      return await this.conversationService.cancel(id, query);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`cancel conversation ${id}`, query.userId, query.role, error);
    }
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Send the conversation to the next approval in the chain.' })
  @ApiResponse({ status: 204, description: 'Updated content' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 403, description: 'Not allowed to perform the action' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post(':id/requestApproval')
  async requestApproval(@Param('id') id: string, @Query() query: UserAndRoleCommonQuery): Promise<void> {
    try {
      await this.conversationService.approveCurrentStep(id, query);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`request approval conversation ${id}`, query.userId, query.role, error);
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieves the conversation with the provided case id.' })
  @ApiResponse({ status: 200, type: Buffer, description: 'Response that contains the PDF result of a document' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get(':id/download')
  async download(@Param('id') id: string, @Query() query: ConversationDownloadQueryDto, @Res() res: Response): Promise<void> {
    try {
      const ret = await this.conversationService.download(id, query);
      this.toBinaryFile(ret, res);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`download conversation ${id}`, query.userId, query.role, error);
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Generate and download the template document from the document API.' })
  @ApiResponse({ status: 200, type: Buffer, description: 'Response that contains the PDF result of a document' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post(':id/preview')
  async preview(
    @Param('id') id: string,
    @Query() query: UserAndRoleCommonQuery,
    @Body() body: ConversationPreviewRequestDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const ret = await this.conversationService.preview(id, query, body);
      this.toBinaryFile(ret, res);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`preview conversation ${id}`, query.userId, query.role, error);
    }
  }

  private toBinaryFile(buffer: Buffer, res: Response): void {
    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(res);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + uuid(),
      'Content-Length': buffer.length
    });
  }
}
