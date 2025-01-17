import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async createUser(@Body() user: Partial<User>): Promise<User> {
        return this.usersService.createUser(user);
    }

    @Get(':email')
    async getUserByEmail(@Param('email') email: string): Promise<User | null> {
        return this.usersService.findUserByEmail(email);
    }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.findAllUsers();
    }

    @Put(':email')
    async updateUser(@Param('email') email: string, @Body() userData: Partial<User>): Promise<User | null> {
        return this.usersService.updateUser(email, userData);
    }

    @Delete(':email')
    async deleteUser(@Param('email') email: string): Promise<User | null> {
    return this.usersService.deleteUser(email);
    }


}
