import { Module } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { WebInquiryController } from './web-inquiry.controller';

@Module({
  controllers: [WebInquiryController],
  imports: [CommonModule, JwtStrategy]
})
export class WebInquiryModule {}
