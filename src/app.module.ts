import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { EmployeesModule } from './employees/employees.module';
import { SubjectsModule } from './subjects/subjects.module';
import { EmailModule } from './email/email.module';
import { SubjectListsModule } from './subject-lists/subject-lists.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    StudentsModule,
    EmployeesModule,
    SubjectsModule,
    EmailModule,
    SubjectListsModule,
    ClassesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
