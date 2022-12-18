import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsEmail, Length } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    name: 'name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ name: 'surname', example: 'Cena' })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({
    name: 'dateOfBirth',
    example: '2017-07-21T17:32:28Z',
  })
  @IsNotEmpty()
  @IsDate()
  dateOfBirth: string;

  @ApiProperty({
    name: 'email',
    example: 'john.cena@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    example: 'a63Ggvie73pd22j-Gdo',
  })
  @IsNotEmpty()
  @Length(8, 128)
  password: string;

  @ApiProperty({
    name: 'classID',
    example: '3ce64d70-0716-474d-8c2b-9f0d1d9a0b45',
  })
  @IsNotEmpty()
  @IsString()
  classID?: string;
}
