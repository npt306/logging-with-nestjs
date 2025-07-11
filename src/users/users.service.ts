
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./interface/user.interface";
import { CreateUserDto } from "./dto/create_user.dto";
import { UpdateUserDto } from "./dto/update_user.dto";
import { RequestContextService } from "../common/context/request-context.service";
@Injectable()
export class UsersService {
    constructor(
        private readonly context: RequestContextService,
    ) { }
    private readonly userList: User[] = [];
    private userIdCounter = 0;

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        this.userIdCounter++;
        const newUser: User = {
            userId: this.userIdCounter.toString(),
            username: createUserDto.username,
            email: createUserDto.email,
            password: createUserDto.password,
        }
        this.userList.push(newUser);
        console.log(`User created: ${newUser.username}, Request ID: ${this.context.getRequestId()}`);
        return newUser;
    }

    async findAllUsers(): Promise<User[]> {
        return this.userList;
    }

    async findUserById(userId: string): Promise<User | undefined> {
        const user = this.userList.find(user => user.userId === userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        console.log(`User found: ${user.username}, Request ID: ${this.context.getRequestId()}`);
        return user;
    }

    async errorExample(): Promise<void> {
        throw new NotFoundException("This is an example error");
    }

}