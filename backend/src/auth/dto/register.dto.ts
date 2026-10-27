import { Equals, IsEmail, IsString, MinLength, MaxLength} from "class-validator";

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
	// Signing up is accepting the terms: no box ticked, no account.
	@Equals(true)
	acceptTerms: boolean;
}