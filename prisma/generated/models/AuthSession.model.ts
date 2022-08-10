import { IsString, IsDefined, IsDate } from "class-validator";
import { Admin, Student, Tutor } from "./";

export class AuthSession {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    sid!: string;

    @IsDefined()
    @IsDate()
    expires!: Date;

    @IsDefined()
    admin!: Admin;

    @IsDefined()
    @IsString()
    adminId!: string;

    @IsDefined()
    student!: Student;

    @IsDefined()
    @IsString()
    studentId!: string;

    @IsDefined()
    tutor!: Tutor;

    @IsDefined()
    @IsString()
    tutorId!: string;
}
