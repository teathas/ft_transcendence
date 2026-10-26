import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { Visibility } from "./create-room.dto";

/** Any subset of the room's settings; what is missing stays as it is. */
export class UpdateRoomDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    subject?: string;

    @IsOptional()
    @IsEnum(Visibility)
    visibility?: Visibility;
}
