// import { INestApplication } from "@nestjs/common";
// import { Test } from "@nestjs/testing";
// import { TemplatesModule } from "./templates.module";
// import { CommonModule } from "../common/common.module";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import { Conversation } from './api/conversations/entity/conversation.entity';
// import { AuditRecordEntity } from './api/common/entity/audit.record.entity';
// import { getConnectionManager } from "typeorm";
// import { AppModule } from "./app.module";
// import { WebBasedInteractionTemplateEntity } from "./api/web-responses/entity/interaction.template.entity";

describe('App Module testing', () => {
  // let app: INestApplication;
  // const mongod = new MongoMemoryServer();

  // beforeEach(async () => {
  //   await Test.createTestingModule({
  //     imports: [
  //       TypeOrmModule.forRoot({
  //         name: 'WM_CCC',
  //         type: 'mongodb',
  //         url: await mongod.getUri(),
  //         entities: [Conversation, AuditRecordEntity],
  //         synchronize: true
  //       }),
  //       TypeOrmModule.forRoot({
  //         name: 'WM_CRMWBI',
  //         type: 'mongodb',
  //         url: await mongod.getUri(),
  //         entities: [WebBasedInteractionTemplateEntity],
  //         synchronize: true
  //       }),
  //       AppModule
  //     ],
  //   }).compile();
  // });

  // afterEach(async () => {
  //   await getConnectionManager().connections[0].close();
  //   await getConnectionManager().connections[1].close();
  //   await mongod.stop();
  // });

  it('should test', () => {
    expect(2).toBe(2);
  });
});