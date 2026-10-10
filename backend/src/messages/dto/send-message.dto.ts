import { IsString, IsNotEmpty, MaxLength, Matches } from "class-validator";

export class SendMessageDto {
    @IsString()
    @IsNotEmpty({ message: 'Message is required' })
    @Matches(/\S/, { message: 'Message cannot contain only whitespace' })
    @MaxLength(2000, { message: 'Message cannot exceed 2000 characters' })
    content: string;
}