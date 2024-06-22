import {Authorized, Body, Get, HeaderParam, JsonController, Post} from "routing-controllers";
import { CredentialsDTO, SignupDTO } from "../dto/auth/user.dto";
import { AuthService } from "./auth.service";
import { TokenDTO } from "../dto/auth/token.dto";
import { SuccessDTO } from "../dto/auth/success.dto";
import { AUTH_REPLACE_VALUE } from "../config/consts";

@JsonController("/auth")
export class AuthController {

    @Post("/authenticate")
    async authenticate(@Body() credentials: CredentialsDTO): Promise<TokenDTO> {
        const token: string = await AuthService.authenticate(credentials);
        return { token };
    }

    @Post("/signup")
    async signup(@Body() signupDTO: SignupDTO): Promise<TokenDTO> {
        const token: string = await AuthService.signup(signupDTO);
        return { token };
    }

    @Authorized()
    @Get("/validateSession")
    async validateSession(@HeaderParam("Authorization") token: string): Promise<SuccessDTO> {
        return { success: true };
    }

    @Authorized()
    @Post("/logout")
    async logout(@HeaderParam("Authorization") token: string): Promise<SuccessDTO> {
        return { success: await AuthService.logout(token.replace(AUTH_REPLACE_VALUE, '')) };
    }
}
