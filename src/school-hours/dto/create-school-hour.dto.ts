import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSchoolHourDto {
  @ApiProperty({
    name: 'startTime',
    example: '08:20:00',
  })
  @IsNotEmpty()
  startTime: string;
}
