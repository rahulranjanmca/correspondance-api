/**
 * the controller for Attachments api
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Duplex } from 'stream';
import { v4 as uuid } from 'uuid';

import { CommonService } from '../common/common.service';
import { UserAndRoleCommonQuery } from '../common/dto/common.query.dto';
import { WmCccErrorDto } from '../common/dto/error.dto';
import { ConversationsService } from './conversations.service';
import { AttachmentDto } from './dto/attachment.dto';
import { AttachmentRequestBodyDto } from './dto/attachment.request.body.dto';

@Controller('conversations')
@ApiTags('Attachments')
export class AttachmentsController {
  private readonly conversationService: ConversationsService;
  private readonly commonService: CommonService;

  constructor(conversationService: ConversationsService, commonService: CommonService) {
    this.conversationService = conversationService;
    this.commonService = commonService;
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Upload a new attachment.',
    description: 'Upload a new attachment into the conversation. The url for the uploaded attachment is returned.'
  })
  @ApiResponse({ status: 200, type: AttachmentDto, description: 'Response that contains an attachment' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Post('/:id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  async addAttachments(
    @Param('id') id: string,
    @Query() query: UserAndRoleCommonQuery,
    @Body() body: AttachmentRequestBodyDto,
    @UploadedFile() file: { buffer: Buffer }
  ): Promise<AttachmentDto> {
    try {
      if (!file || !file.buffer) {
        throw CommonService.getHttpError('file not exist', HttpStatus.BAD_REQUEST);
      }

      return await this.conversationService.addAttachment(id, query, body, file.buffer);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`add attachments ${id}`, query.userId, query.role, error);
    }
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve attachment.', description: 'Get a single attachment for given conversation id and attachment id.' })
  @ApiResponse({ status: 200, type: AttachmentDto, description: 'Response that contains an attachment' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get('/:id/attachments/:attachmentId')
  async get(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @Query() query: UserAndRoleCommonQuery
  ): Promise<AttachmentDto> {
    try {
      return await this.conversationService.getAttachment(id, query, attachmentId);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`get attachments ${id} ${attachmentId}`, query.userId, query.role, error);
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

  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve attachment.', description: 'Get a single attachment for given conversation id and attachment id.' })
  @ApiResponse({ status: 200, type: Buffer, description: 'Response that contains an attachment' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Get('/:id/attachments/:attachmentId/download')
  async download(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @Query() query: UserAndRoleCommonQuery,
    @Res() response: Response
  ): Promise<void> {
    try {
      const buffer = await this.conversationService.downloadAttachment(id, query, attachmentId);
      this.toBinaryFile(buffer, response);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`get attachments ${id} ${attachmentId}`, query.userId, query.role, error);
    }
  }

  @HttpCode(204)
  @ApiOperation({
    summary: 'Upload a new attachment.',
    description: 'Upload a new attachment into the conversation. The url for the uploaded attachment is returned.'
  })
  @ApiResponse({ status: 204, type: AttachmentDto, description: 'Response that contains an attachment' })
  @ApiResponse({ status: 400, type: WmCccErrorDto, description: 'Bad request - Problem with the request (E.g. Missing parameters)' })
  @ApiResponse({ status: 404, type: WmCccErrorDto, description: 'Not found - Requested entity is not found in database' })
  @ApiResponse({
    status: 500,
    type: WmCccErrorDto,
    description: 'Internal Server Error - Request is valid but operation failed at server side'
  })
  @Delete('/:id/attachments/:attachmentId')
  async deleteAttachments(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @Query() query: UserAndRoleCommonQuery
  ): Promise<void> {
    try {
      await this.conversationService.deleteAttachment(id, query, attachmentId);
    } catch (error) {
      throw await this.commonService.saveErrorAuditRecord(`delete ${id} ${attachmentId}`, query.userId, query.role, error);
    }
  }
}
