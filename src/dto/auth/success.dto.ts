import {IsBoolean} from "class-validator";

export class SuccessDTO {
    @IsBoolean()
    success: boolean;
}
