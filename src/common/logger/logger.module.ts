import { Module } from "@nestjs/common";
import { HttpLogger } from "./http.logger";
import { ErrorLogger } from "./error.logger";

@Module({
    providers: [HttpLogger, ErrorLogger],
    exports: [HttpLogger, ErrorLogger],
})
export class LoggerModule { }