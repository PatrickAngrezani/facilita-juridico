import { Module } from '@nestjs/common';
import { DbModule } from './db-module/db-module.module';
import { ClientsService } from './clients/clients.service';
import { ClientsController } from './clients/clients.controller';

@Module({
  imports: [DbModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class AppModule {}
