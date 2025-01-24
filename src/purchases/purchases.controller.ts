import {
    Controller,
    Post,
    Get,
    Param,
    UseGuards,
    Request,
    Body,
  } from '@nestjs/common';
  import { PurchasesService } from './purchases.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { RolesGuard } from '../auth/guards/roles.guard';
  
  @Controller('purchases')
  export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) {}
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('student')
    @Post()
    async createPurchase(@Request() req: any, @Body('courseId') courseId: string) {
      const studentId = req.user.sub; //sub trae el ID desde el token propiedades: sub, email, rol.
      return this.purchasesService.createPurchase(studentId, courseId);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('student')
    @Get('student')
    async getPurchasesByStudent(@Request() req: any) {
      const studentId = req.user.userId;
      return this.purchasesService.getPurchasesByStudent(studentId);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    @Get('course/:id')
    async getPurchasesByCourse(@Param('id') courseId: string) {
      return this.purchasesService.getPurchasesByCourse(courseId);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    async getAllPurchases() {
      return this.purchasesService.getAllPurchases();
    }
  }
  