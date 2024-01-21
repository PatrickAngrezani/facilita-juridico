import { Module } from '@nestjs/common';
import { DbModule } from './db-module/db-module.module';
import { ClientsService } from './clients/clients.service';
import { ClientsController } from './clients/clients.controller';
import { DijkstraService } from './dijkstra/dijkstra.service';

@Module({
  imports: [DbModule],
  controllers: [ClientsController],
  providers: [ClientsService, DijkstraService],
})
export class AppModule {}
