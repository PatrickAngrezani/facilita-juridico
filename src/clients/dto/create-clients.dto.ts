import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  phoneNumber: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
