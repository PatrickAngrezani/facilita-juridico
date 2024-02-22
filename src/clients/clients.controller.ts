import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-clients.dto';
import { DijkstraService } from '../dijkstra/dijkstra.service';
import { Client } from '../db-module/entity/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly dijkstraService: DijkstraService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.clientsService.findClients(query);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientsService.create(createClientDto);
  }

  @Get('/ordinate-points')
  async dijkstra() {
    const users: Client[] = await this.clientsService.findClients();

    const points = users.map((user) => ({
      id: user.id,
      name: user.name,
      x: user.x,
      y: user.y,
    }));
    return this.dijkstraService.dijkstra(points);
  }

  @Delete('/:clientId?')
  async delete(@Param('clientId') clientId?: number): Promise<string> {
    return await this.clientsService.delete(clientId);
  }
}
