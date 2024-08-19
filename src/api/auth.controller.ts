import { Authorized, Body, Get, HeaderParam, JsonController, Param, Post, Res } from "routing-controllers";
import { AuthService } from "./auth.service";
import { CredentialsDTO, SignupDTO, UserDTO } from "../dto/auth/user.dto";
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
    @Get("/userProfile")
    async userProfile(@HeaderParam("Authorization") token: string): Promise<{ name: string, image: string }> {
        const user: UserDTO = await AuthService.userProfile(token.replace(AUTH_REPLACE_VALUE, ''));
        return { name: user.name, image: user.image };
    }

    @Authorized()
    @Post("/generateProfileImage")
    async generateProfileImage(@HeaderParam("Authorization") token: string, @Body() body: { prompt: string }): Promise<{ image: string }> {
        return { image: await AuthService.generateProfileImage(token.replace(AUTH_REPLACE_VALUE, ''), body.prompt) };
    }

    @Authorized()
    @Post("/logout")
    async logout(@HeaderParam("Authorization") token: string): Promise<SuccessDTO> {
        return { success: await AuthService.logout(token.replace(AUTH_REPLACE_VALUE, '')) };
    }
}
