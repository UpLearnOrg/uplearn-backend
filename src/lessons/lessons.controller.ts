import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateManyLessonsDto } from './dto/create-many-lessons.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
@ApiTags('Lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(Role.employee, Role.admin)
  @Post('create')
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonsService.create(createLessonDto);
  }

  @Roles(Role.employee, Role.admin)
  @Post('create-many')
  async createMany(@Body() createManyLessonsDto: CreateManyLessonsDto) {
    return await this.lessonsService.createLessonsForWholeSchoolYear(
      createManyLessonsDto,
    );
  }

  @Get('lessons-by-class-and-date-range/:name/:start/:end')
  async getLessonsByClassAndDateRange(
    @Param('name') className: string,
    @Param('start') startDate: string,
    @Param('end') endDate: string,
  ) {
    return await this.lessonsService.getLessonsByClassAndDateRange(
      className,
      startDate,
      endDate,
    );
  }

  @Roles(Role.employee, Role.admin)
  @Get('lessons-by-employee-and-date-range/:employeeId/:start/:end')
  async getLessonsByEmployeeAndDateRange(
    @Param('employeeId') employeeId: string,
    @Param('start') startDate: string,
    @Param('end') endDate: string,
  ) {
    return await this.lessonsService.getLessonsByEmployeeAndDateRange(
      employeeId,
      startDate,
      endDate,
    );
  }

  @Get()
  async findMany() {
    return await this.lessonsService.findMany();
  }

  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return await this.lessonsService.findUnique(id);
  }

  @Get('upcoming-gradings/:className')
  async getUpcomingGradings(@Param('className') className: string) {
    return await this.lessonsService.getUpcomingGradings(className);
  }

  @Roles(Role.employee, Role.admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.lessonsService.delete(id);
  }

  @Roles(Role.employee, Role.admin)
  @Delete('delete-many/:lessonGroupId')
  async deleteMany(@Param('lessonGroupId') lessonGroupId: string) {
    return await this.lessonsService.deleteMany(lessonGroupId);
  }
}
