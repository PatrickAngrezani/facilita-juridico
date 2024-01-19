import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-clients.dto';
import { PG_CONNECTION } from 'src/db-module/db-module.module';
import { Client } from 'src/map/client';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    @Inject(PG_CONNECTION) private conn: any,
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

  @Get('path')
  async shortestPath() {
    const query = `SELECT * FROM clients`;
    const res = await this.conn.query(query);
    const users = res.rows;
    const clients = users.map((user) => new Client(user.id, user.x, user.y));

    return this.clientsService.shortestPath(clients);
  }
}
