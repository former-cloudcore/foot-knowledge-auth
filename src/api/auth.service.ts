import {compare, hash} from 'bcrypt';
import {sign, verify} from 'jsonwebtoken';
import { CredentialsDTO, SignupDTO, UserDTO } from "../dto/auth/user.dto";
import { singleton } from "../decorators/singleton.decorator";
import { AuthBroker } from "./auth.broker";
import { StatusCodes } from "http-status-codes";
import {CustomError} from "../models/custom-error.model";

const SECRET_KEY: string = '5017b2cd-76b0-42be-8d76-35a506687b85';
const DEFAULT_EXPIRY_TIME: string = '24h';
const SALT_ROUNDS: number = 10;

@singleton
export class AuthService {
    async signup(signupDTO: SignupDTO): Promise<string> {
        const { email, password } = signupDTO.credentials;
        const existingUser = await new AuthBroker().getUser(email);

        if (existingUser) {
            throw new CustomError(`User already exists with email: ${email}`, StatusCodes.CONFLICT);
        }

        const hashedPassword: string = await hash(password, SALT_ROUNDS);
        const userDTO: UserDTO = {
            ...signupDTO,
            _id: '',
            credentials: { email, password: hashedPassword },
            token: '',
            lastLogin: new Date()
        };
        const token: string = await this.generateToken(email);
        userDTO.token = token;

        await new AuthBroker().createUser(userDTO);
        return token;
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            verify(token, SECRET_KEY);
            return new AuthBroker().validateToken(token);
        } catch (error) {
            return false;
        }
    }

    async logout(token: string): Promise<boolean> {
        return await new AuthBroker().logout(token);
    }

    async authenticate(credentials: CredentialsDTO): Promise<string> {
        const userFromDb: UserDTO = await new AuthBroker().getUser(credentials.email);
        if (!userFromDb || !(await compare(credentials.password, userFromDb.credentials.password))) {
            throw new CustomError(`Failed to log user in. Invalid credentials provided: Email: ${credentials.email}`, StatusCodes.FORBIDDEN);
        }
        const token: string = await this.generateToken(credentials.email);
        await new AuthBroker().setToken(credentials, token);
        return token;
    }

    private async generateToken(data: string): Promise<string> {
        return sign({ data }, SECRET_KEY, { expiresIn: DEFAULT_EXPIRY_TIME });
    }
}
