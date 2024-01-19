import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PG_CONNECTION } from 'src/db-module/db-module.module';
import { CreateClientDto } from './dto/create-clients.dto';
import { CreateClientResponseDto } from './dto/response/create-clients.response.dto';
import { Client } from 'src/map/client';

@Injectable()
export class ClientsService implements OnModuleInit {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async onModuleInit() {
    await this.conn.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE SCHEMA IF NOT EXISTS postgres;
      CREATE TABLE IF NOT EXISTS postgres.clients (id UUID DEFAULT uuid_generate_v4(),
      name VARCHAR (100),
      email VARCHAR (100) UNIQUE,
      phone_number VARCHAR UNIQUE,
      x INTEGER,
      y INTEGER,
      PRIMARY KEY (id))
      `,
    );
  }

  async findAll(query: any) {
    let whereClause = '';
    const values = [];
    for (const key in query) {
      whereClause += `${key} = $${values.length + 1} AND `;
      values.push(query[key]);
    }
    whereClause = whereClause.endsWith('AND ')
      ? whereClause.slice(0, -5)
      : whereClause;
    const _query = `SELECT * FROM clients WHERE ${whereClause}`;
    const res = await this.conn.query(_query, values);

    return res.rows;
  }

  async create(
    createClientDto: CreateClientDto,
  ): Promise<CreateClientResponseDto> {
    const query = `INSERT INTO clients (name, email, phone_number, x, y) VALUES ($1, $2, $3, $4, $5)`;
    const values = [
      createClientDto.name,
      createClientDto.email,
      createClientDto.phoneNumber,
      createClientDto.x,
      createClientDto.y,
    ];

    if (createClientDto.x < 0 || createClientDto.y < 0) {
      throw new BadRequestException({ coordinate: 'invalid' });
    }

    await this.conn.query(query, values);

    return {
      email: createClientDto.email,
      x: createClientDto.x,
      y: createClientDto.y,
    };
  }

  async map() {
    const res = await this.conn.query('SELECT * FROM clients');
    const clients = res.rows;

    const maxX = Math.max(...clients.map((client) => client.x));
    const maxY = Math.max(...clients.map((client) => client.y));

    const map = Array.from({ length: maxX + 1 }, () => Array(maxY + 1));

    for (const client of clients) {
      if (client.x <= maxX && client.y <= maxY) {
        map[client.x][client.y] = client;
      }
    }

    const filteredMap = map.map((subArray) =>
      subArray.filter((item) => item !== null),
    );

    return filteredMap;
  }

  async shortestPath(clients: Client[]) {
    clients.push(new Client(-1, 0, 0));
    clients.sort((a, b) => a.angle() - b.angle());

    let totalDistance = 0;
    for (let i = 0; i < clients.length - 1; i++) {
      totalDistance += clients[i].distanceTo(clients[i + 1]);
    }

    clients.pop();

    return { totalDistance, clients };
  }
}
