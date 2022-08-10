import { IsString, IsDefined, IsOptional, IsInt, IsDate, IsBoolean } from "class-validator";
import { Session, AuthSession } from "./";

export class Tutor {
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
    @IsString()
    subjects!: string;

    @IsDefined()
    @IsDate()
    availability!: Date;

    @IsDefined()
    @IsBoolean()
    darkMode!: boolean;

    @IsDefined()
    hoursTerm!: number;

    @IsDefined()
    hoursTotal!: number;

    @IsDefined()
    sessions!: Session[];

    @IsDefined()
    AuthSession!: AuthSession[];
}
