import {IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested} from 'class-validator';
import {StatusCodes} from "http-status-codes";

export class ResultDTO {
    @IsNumber()
    type: StatusCodes;

    @IsOptional()
    @IsObject()
    reason: any;

    @IsOptional()
    @IsArray()
    errors?: Array<any>;
}
