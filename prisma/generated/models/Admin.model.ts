import { IsString, IsDefined, IsOptional, IsBoolean } from "class-validator";
import "./";

export class Admin {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    apiKey!: string;

    @IsDefined()
    @IsString()
    firstName!: string;

    @IsDefined()
    @IsString()
    lastName!: string;

    @IsDefined()
    @IsString()
    pic!: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsDefined()
    @IsString()
    email!: string;

    @IsDefined()
    @IsBoolean()
    darkMode!: boolean;
}
