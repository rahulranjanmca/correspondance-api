import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonService } from './common.service';
import { AuditRecordEntity } from './entity/audit.record.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([AuditRecordEntity], 'WM_CCC'),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' }
      })
    })
  ],
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonModule {}
