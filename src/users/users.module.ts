import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { RequestContexModule } from "../common/context/request-context.module";
@Module({
    imports: [RequestContexModule,],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }