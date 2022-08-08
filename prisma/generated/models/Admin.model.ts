import { IsString, IsDefined, IsBoolean } from "class-validator";
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
    username!: string;

    @IsDefined()
    @IsString()
    pic!: string;

    @IsDefined()
    @IsString()
    phone!: string;

    @IsDefined()
    @IsString()
    email!: string;

    @IsDefined()
    @IsString()
    authKey!: string;

    @IsDefined()
    @IsBoolean()
    darkMode!: boolean;
}
