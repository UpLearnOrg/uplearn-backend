import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create({
    name,
    surname,
    dateOfBirth,
    email,
    password,
  }: CreateStudentDto) {
    const hashedPassword = await this.hashPassword(password);

    try {
      const newStudent = await this.prisma.student.create({
        data: { name, surname, dateOfBirth, email, password: hashedPassword },
      });
      return newStudent;
    } catch (e) {
      console.log(e); //! fix this
    }
  }

  findAll() {
    return this.prisma.student.findMany();
  }

  findOne(id: string) {
    return this.prisma.student.findUnique({ where: { id } });
  }

  async update(
    id: string,
    { name, surname, dateOfBirth, email, password, classId }: UpdateStudentDto,
  ) {
    try {
      const hashedPassword = await this.hashPassword(password);

      const updatedStudent = await this.prisma.student.update({
        where: { id },
        data: {
          name,
          surname,
          dateOfBirth,
          email,
          password: hashedPassword,
          classId,
        },
      });

      return updatedStudent;
    } catch (e) {
      console.log(e);
    }
  }

  remove(id: string) {
    return this.prisma.student.delete({ where: { id } });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, await bcrypt.genSalt());
  }
}
