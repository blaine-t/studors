import { IsString, IsDefined, IsDate } from "class-validator";
import { Tutor, Student } from "./";

export class Session {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsDate()
    time!: Date;

    @IsDefined()
    tutor!: Tutor;

    @IsDefined()
    @IsString()
    tutorId!: string;

    @IsDefined()
    student!: Student;

    @IsDefined()
    @IsString()
    studentId!: string;
}
