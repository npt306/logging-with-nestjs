import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { UsersService } from './users.service';
import { User } from "./interface/user.interface";
import { CreateUserDto } from "./dto/create_user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getALLUsers(): Promise<User[]> {
        return this.usersService.findAllUsers();
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto)
    }

    @Get('findUserById')
    async getUserById(@Query('userId') userId: string): Promise<User | undefined> {
        return this.usersService.findUserById(userId);
    }
}