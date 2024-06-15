import {IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested} from 'class-validator';
import {StatusCodes} from "http-status-codes";

export class ResultDTO {
    @IsNumber()
    type: StatusCodes;

    @IsObject()
    reason: any;

    @IsOptional()
    @IsObject()
    entity?: any;

    @IsOptional()
    @IsString()
    statusMessage?: string;

    @IsOptional()
    @IsArray()
    errors?: Array<any>;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    suggestions?: any;
}
