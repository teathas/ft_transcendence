import { IsEmail, IsString, MinLength, MaxLength, Min } from "class-validator";

export class RegisterDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	username: string;

	@IsString()
	@MinLength(8)
	password: string;
}