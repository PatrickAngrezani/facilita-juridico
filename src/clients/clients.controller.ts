import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-clients.dto';
import { DijkstraService } from 'src/dijkstra/dijkstra.service';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly dijkstraService: DijkstraService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.clientsService.findAll(query);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientsService.create(createClientDto);
  }

  @Get('create-map')
  async map() {
    return await this.clientsService.map();
  }

  @Get('dijkstra')
  async dijkstra() {
    const users = await this.clientsService.findAll();
    const points = users.map((user) => ({ x: user.x, y: user.y }));
    return this.dijkstraService.dijkstra(points);
  }
}
