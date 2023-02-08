import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectToEmployeeSubjectDto } from './dto/connect-to-employee-subject.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger: Logger = new Logger(ClassesService.name);

  async create(createClassDto: CreateClassDto) {
    const studentConnections: { id: string }[] = [];

    createClassDto.students.forEach((student) => {
      studentConnections.push({ id: student.value });
    });

    const newClass = await this.prisma.class
      .create({
        data: {
          name: createClassDto.name,
          year: createClassDto.year,
          subjectListId: createClassDto.subjectListId,
          classTeacherId: createClassDto.classTeacherId,
          substituteClassTeacherId: createClassDto.substituteClassTeacherId,
          Student: {
            connect: studentConnections,
          },
        },
      })
      .catch(() => {
        throw new BadRequestException({
          cause: 'Something went wrong, please try again later',
        });
      });

    if (!newClass)
      throw new BadRequestException({
        cause: 'Something went wrong, please try again later',
      });

    return newClass;
  }

  async update(name: string, updateClassDto: UpdateClassDto) {
    const studentConnections: { id: string }[] = [];

    updateClassDto.students?.forEach((student) => {
      studentConnections.push({ id: student.value });
    });

    const { students, ...other } = updateClassDto;

    const newClass = await this.prisma.class
      .update({
        where: { name },
        data: {
          ...other,
          Student: {
            connect: studentConnections,
          },
        },
      })
      .catch(() => {
        throw new BadRequestException({
          cause: 'Something went wrong, please try again later',
        });
      });

    if (!newClass)
      throw new BadRequestException({
        cause: 'Something went wrong, please try again later',
      });

    return newClass;
  }

  async findMany() {
    return await this.prisma.class.findMany({
      include: {
        Student: {
          include: {
            user: true,
          },
        },
        classTeacher: {
          include: {
            user: true,
          },
        },
        substituteClassTeacher: {
          include: {
            user: true,
          },
        },
        subjectList: {
          include: {
            Subject_SubjectList: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });
  }

  async connectToEmployeeSubject(
    name: string,
    connectToEmployeeSubjectDto: ConnectToEmployeeSubjectDto,
  ) {
    console.log(connectToEmployeeSubjectDto);

    const exists = await this.prisma.employee_Subject_Class.findUnique({
      where: {
        subjectAbbreviation_className: {
          className: name,
          subjectAbbreviation: connectToEmployeeSubjectDto.subjectAbbreviation,
        },
      },
    });

    await this.prisma.lesson.updateMany({
      where: {
        className: name,
        subjectAbbreviation: connectToEmployeeSubjectDto.subjectAbbreviation,
        date: {
          gte: new Date(),
        },
      },
      data: {
        employeeId: connectToEmployeeSubjectDto.employeeId,
      },
    });

    if (exists === null) {
      return await this.prisma.employee_Subject_Class.create({
        data: {
          className: name,
          subjectAbbreviation: connectToEmployeeSubjectDto.subjectAbbreviation,
          employeeId: connectToEmployeeSubjectDto.employeeId,
        },
      });
    }

    return await this.prisma.employee_Subject_Class.update({
      where: {
        subjectAbbreviation_className: {
          subjectAbbreviation: connectToEmployeeSubjectDto.subjectAbbreviation,
          className: name,
        },
      },
      data: {
        employeeId: connectToEmployeeSubjectDto.employeeId,
      },
    });
  }

  async findUnique(name: string) {
    return await this.prisma.class.findUnique({
      where: { name },
      include: {
        Student: {
          include: {
            user: true,
          },
        },
        classTeacher: {
          include: {
            user: true,
          },
        },
        substituteClassTeacher: {
          include: {
            user: true,
          },
        },
        subjectList: {
          include: {
            Subject_SubjectList: {
              include: {
                subject: {
                  include: {
                    Employee_Subject: {
                      include: {
                        employee: {
                          include: {
                            user: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Employee_Subject_Class: {
          include: {
            employee_Subject: {
              include: {
                employee: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async delete(name: string) {
    return await this.prisma.class.delete({
      where: { name },
    });
  }
}
