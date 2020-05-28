import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { WebBasedInteractionTemplateEntity } from './entity/interaction.template.entity';
import { WebResponsesController } from './web-responses.controller';
import { WebResponsesService } from './web-responses.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebBasedInteractionTemplateEntity], 'WM_CRMWBI'), CommonModule, JwtStrategy],
  providers: [WebResponsesService],
  controllers: [WebResponsesController]
})
export class WebResponsesModule {}
