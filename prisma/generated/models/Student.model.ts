import { IsString, IsDefined, IsOptional, IsInt, IsBoolean } from "class-validator";
import { Session } from "./";

export class Student {
    @IsDefined()
    @IsString()
    id!: string;

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
    @IsInt()
    grade!: number;

    @IsDefined()
    @IsBoolean()
    darkMode!: boolean;

    @IsDefined()
    sessions!: Session[];
}
