import { IsString, IsDefined, IsDate, IsOptional } from "class-validator";
import { Tutor, Student } from "./";

export class Session {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    subject!: string;

    @IsDefined()
    @IsDate()
    time!: Date;

    @IsDefined()
    tutor!: Tutor;

    @IsOptional()
    Student?: Student;

    @IsOptional()
    @IsString()
    studentId?: string;

    @IsDefined()
    @IsString()
    tutorId!: string;
}
