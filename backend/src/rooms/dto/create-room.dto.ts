import { IsString, IsNotEmpty, IsEnum  } from "class-validator";

export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsEnum(Visibility)
    visibility: Visibility;
}