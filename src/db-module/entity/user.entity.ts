import { IsNumber, IsString } from 'class-validator';

export class User {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  phone_number: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
