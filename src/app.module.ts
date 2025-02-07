import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProtectedModule } from './protected-example/protected.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PurchasesModule } from './purchases/purchases.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ProtectedModule, CoursesModule, EnrollmentsModule, PurchasesModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
