import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export const LANGUAGES = ['en', 'fr', 'ar'];
export const ACCENT_COLORS = ['indigo', 'blue', 'teal', 'rose', 'orange'];

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	username?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	@MaxLength(280)
	bio?: string;

	// `null` clears the choice; IsOptional lets it through.
	@IsOptional()
	@IsIn(LANGUAGES)
	language?: string | null;

	@IsOptional()
	@IsIn(ACCENT_COLORS)
	accentColor?: string | null;
}