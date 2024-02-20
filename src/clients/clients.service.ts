import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PG_CONNECTION } from '../db-module/db-module.module';
import { CreateClientDto } from './dto/create-clients.dto';
import { CreateClientResponseDto } from './dto/response/create-clients.response.dto';

@Injectable()
export class ClientsService implements OnModuleInit {
  constructor(@Inject(PG_CONNECTION) public conn: any) {}

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

  async findAll(query?: any) {
    let whereClause = '';
    const values = [];
    for (const key in query) {
      whereClause += `${key} = $${values.length + 1} AND `;
      values.push(query[key]);
    }
    whereClause = whereClause.endsWith('AND ')
      ? whereClause.slice(0, -5)
      : whereClause;

    const orderByClause = 'ORDER BY name ASC';

    const _query =
      whereClause != ''
        ? `SELECT * FROM clients WHERE ${whereClause} ${orderByClause}`
        : `SELECT * FROM clients ${orderByClause}`;
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

  async delete(clientId?: string): Promise<string> {
    try {
      const query = clientId
        ? `DELETE FROM clients WHERE id='${clientId}'`
        : 'DELETE FROM CLIENTS';

      const response = clientId
        ? `Id deleted succesfully: ${clientId}`
        : 'All users deleted succesfully';

      const result = await this.conn.query(query);

      if (result.rowCount === 0) {
        throw new NotFoundException();
      } else {
        return response;
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
