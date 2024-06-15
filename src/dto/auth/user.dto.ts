import {IsDate, IsEmail, IsJWT, IsMongoId, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CredentialsDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class SignupDTO {
    @IsString()
    name: string;

    @IsString()
    role: string;

    @ValidateNested()
    @Type(() => CredentialsDTO)    credentials: CredentialsDTO;
}

export class UserDTO extends SignupDTO {
    @IsMongoId()
    _id: string;

    @IsJWT()
    token: string;

    @IsDate()
    lastLogin: Date;
}
