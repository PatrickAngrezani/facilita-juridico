import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../../clients/clients.service';
import { User } from '../../db-module/entity/user.entity';
import { ClientsController } from '../../clients/clients.controller';
import { DijkstraService } from '../../dijkstra/dijkstra.service';
import { CreateClientDto } from 'src/clients/dto/create-clients.dto';

describe('ClientsService', () => {
  let clientsService: ClientsService;

  beforeEach(async () => {
    const mockPgConnection = {
      query: jest.fn().mockResolvedValue({
        rows: [
          {
            id: '1',
            name: 'Test1',
            phone_number: '(12)34567891',
            email: 'test1@gmail.com',
            x: 21,
            y: 89,
          },
          {
            id: '2',
            name: 'Test2',
            phone_number: '(12)34567892',
            email: 'test2@gmail.com',
            x: 97,
            y: 32,
          },
          {
            id: '3',
            name: 'Test3',
            phone_number: '(12)34567893',
            email: 'test3@gmail.com',
            x: 64,
            y: 23,
          },
        ],
      }),
      release: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        DijkstraService,
        {
          provide: 'PG_CONNECTION',
          useValue: mockPgConnection,
        },
      ],
      controllers: [ClientsController],
    }).compile();

    clientsService = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('clientsService', () => {
    it('should be defined', () => {
      expect(clientsService).toBeDefined();
    });

    it('should return all clients', async () => {
      const expectedClients: User[] = [
        {
          id: '1',
          name: 'Test1',
          phone_number: '(12)34567891',
          email: 'test1@gmail.com',
          x: 21,
          y: 89,
        },
        {
          id: '2',
          name: 'Test2',
          phone_number: '(12)34567892',
          email: 'test2@gmail.com',
          x: 97,
          y: 32,
        },
        {
          id: '3',
          name: 'Test3',
          phone_number: '(12)34567893',
          email: 'test3@gmail.com',
          x: 64,
          y: 23,
        },
      ];
      const clients = await clientsService.findAll();

      expect(clients).toBeDefined();
      expect(clients).toEqual(expectedClients);
    });

    it('should findOne generates correct SQL query', async () => {
      const query = { name: 'John' };
      const querySpy = jest.spyOn(clientsService.conn, 'query');

      await clientsService.findAll(query);

      expect(querySpy).toHaveBeenCalledWith(
        'SELECT * FROM clients WHERE name = $1 ORDER BY name ASC',
        ['John'],
      );
    });

    it('should return the correct specific client', async () => {
      jest
        .spyOn(clientsService.conn, 'query')
        .mockImplementation((query, values) => {
          if (
            query ===
              'SELECT * FROM clients WHERE name = $1 ORDER BY name ASC' &&
            values[0] === 'Test1'
          ) {
            return Promise.resolve({
              rows: [
                {
                  id: 1,
                  name: 'Test1',
                  email: 'test1@gmail.com',
                  phone_number: '(12)34567891',
                  x: 21,
                  y: 89,
                },
              ],
            });
          }

          return Promise.resolve({ rows: [] });
        });

      const query = { name: 'Test1' };

      const response = await clientsService.findAll(query);

      expect(response).toEqual([
        {
          id: 1,
          name: 'Test1',
          email: 'test1@gmail.com',
          phone_number: '(12)34567891',
          x: 21,
          y: 89,
        },
      ]);
    });

    it('should create generates correct SQL query', async () => {
      const createClientDto: CreateClientDto = {
        email: 'testcreatefunction@getMaxListeners.com',
        name: 'Test Create Function',
        phoneNumber: '11995457584',
        x: 20,
        y: 37,
      };

      const querySpy = jest.spyOn(clientsService.conn, 'query');

      const newUser = await clientsService.create(createClientDto);

      expect(newUser).toBeDefined();
      expect(newUser.email).toEqual(createClientDto.email);
      expect(querySpy).toHaveBeenCalledWith(
        'INSERT INTO clients (name, email, phone_number, x, y) VALUES ($1, $2, $3, $4, $5)',
        [
          'Test Create Function',
          'testcreatefunction@getMaxListeners.com',
          '11995457584',
          20,
          37,
        ],
      );
    });
  });
});
