import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSubjectListDto } from './dto/create-subject-list.dto';
import { SubjectListsService } from './subject-lists.service';

@Controller('subject-lists')
@ApiTags('Subject Lists')
export class SubjectListsController {
  constructor(private readonly subjectListsService: SubjectListsService) {}

  @Post('create')
  async create(@Body() createSubjectListDto: CreateSubjectListDto) {
    return await this.subjectListsService.create(createSubjectListDto);
  }

  @Get()
  async findAll() {
    return await this.subjectListsService.findAll();
  }
}