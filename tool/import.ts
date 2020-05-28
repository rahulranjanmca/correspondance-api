import { WebBasedInteractionTemplateEntity } from '../src/api/web-responses/entity/interaction.template.entity';
import { createConnection } from "typeorm";
import { promises as fs } from 'fs';

(async () => {
  try {
    require('dotenv-safe').config();
    const dataList = JSON.parse(await (await fs.readFile('./tool/wbi-catalog.json')).toString()) as WebBasedInteractionTemplateEntity[];

    const connection = await createConnection({
      type: 'mongodb',
      host: process.env.WM_CRMWBI_DATASTORE_HOST,
      port: Number(process.env.WM_CRMWBI_DATASTORE_PORT),
      database: process.env.WM_CRMWBI_DATASTORE_DB_NAME,
      // username: process.env.WM_CRMWBI_DATASTORE_USER,
      // password: process.env.WM_CRMWBI_DATASTORE_PASSWORD,
      entities: [WebBasedInteractionTemplateEntity],
      synchronize: true,
    });

    const repo = connection.getMongoRepository(WebBasedInteractionTemplateEntity);

    try {
      if (await repo.count() > 0) {
        console.log('start try to clear data');
        await repo.clear();
      }
    } catch (error) {
    }

    console.log('start insert data length =', dataList.length);

    for (const data of dataList) {
      try {
        await repo.save(data);
      } catch (error) {
        console.error('insert data', data, 'failed, skip it');
      }
    }

    console.log('end insert data');

    await connection.close();

    process.exit(0);
  } catch (err) {
    console.log(JSON.stringify({ ...err, message: err.message, stack: err.stack }));

    process.exit(0);
  }
})();
