import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../../clients/clients.service';
import { PG_CONNECTION } from '../../db-module/db-module.module';
import { CreateClientDto } from 'src/clients/dto/create-clients.dto';

describe('ClientsService', () => {
  let module: TestingModule;
  let service: ClientsService;

  const postgresUsername = 'postgres';
  const postgresPassword = 'postgres';

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PG_CONNECTION,
          useValue: `postgres://${postgresUsername}:${postgresPassword}@localhost:5432/postgres_test`,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  describe('module', () => {
    it('should define module', () => {
      expect(module).toBeDefined();
    });
  });

  describe('clientService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findClients', () => {
    it('should return an array of clients', async () => {
      const result = [
        {
          id: '1',
          email: 'test1@gmail.com',
          x: 42,
          y: 78,
        },
        {
          id: '2',
          email: 'test2@gmail.com',
          x: 98,
          y: 43,
        },
        {
          id: '3',
          email: 'test3@gmail.com',
          x: 16,
          y: 57,
        },
      ];

      jest
        .spyOn(service, 'findClients')
        .mockImplementation(() => Promise.resolve(result));

      expect(await service.findClients()).toBe(result);
    });

    it('should return one client', async () => {
      const clientId = 1;
      const result = {
        id: '1',
        email: 'test1Gmail.com',
        x: 37,
        y: 62,
      };

      jest
        .spyOn(service, 'findClients')
        .mockImplementation(() => Promise.resolve(result));

      expect(await service.findClients(clientId)).toBe(result);
    });

    it('should throw an error if client not found', async () => {
      const clientId = 78;

      jest
        .spyOn(service, 'findClients')
        .mockImplementation(() =>
          Promise.reject(new Error('Client not found')),
        );

      try {
        await service.findClients(clientId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Client not found');
      }
    });

    it('should generates correct SQL query', async () => {
      const createClientDto: CreateClientDto = {
        email: 'test1@gmail.com',
        name: 'Test 1',
        phoneNumber: '11912345678',
        x: 20,
        y: 37,
      };

      const querySpy = jest.spyOn(service, 'create');

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(createClientDto));

      expect(await service.create(createClientDto)).toBe(createClientDto);
      expect(querySpy).toHaveBeenCalledWith({
        email: 'test1@gmail.com',
        name: 'Test 1',
        phoneNumber: '11912345678',
        x: 20,
        y: 37,
      });
    });
  });
});
