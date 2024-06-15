import {compare, hash} from 'bcrypt';
import {sign, verify} from 'jsonwebtoken';
import { CredentialsDTO, SignupDTO, UserDTO } from "../dto/auth/user.dto";
import { AuthBroker } from "./auth.broker";
import { StatusCodes } from "http-status-codes";
import {CustomError} from "../models/custom-error.model";

const SECRET_KEY: string = '5017b2cd-76b0-42be-8d76-35a506687b85';
const DEFAULT_EXPIRY_TIME: string = '24h';
const SALT_ROUNDS: number = 10;

export class AuthService {

    static async signup(signupDTO: SignupDTO): Promise<string> {
        const { email, password } = signupDTO.credentials;
        const existingUser = await AuthBroker.getUser(email);

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
        const token: string = await AuthService.generateToken(email);
        userDTO.token = token;

        await AuthBroker.createUser(userDTO);
        return token;
    }

    static async validateToken(token: string): Promise<boolean> {
        try {
            verify(token, SECRET_KEY);
            return AuthBroker.validateToken(token);
        } catch (error) {
            return false;
        }
    }

    static async logout(token: string): Promise<boolean> {
        return await AuthBroker.logout(token);
    }

    static async authenticate(credentials: CredentialsDTO): Promise<string> {
        const userFromDb: UserDTO = await AuthBroker.getUser(credentials.email);
        if (!userFromDb || !(await compare(credentials.password, userFromDb.credentials.password))) {
            throw new CustomError(`Failed to log user in. Invalid credentials provided: Email: ${credentials.email}`, StatusCodes.FORBIDDEN);
        }
        const token: string = await AuthService.generateToken(credentials.email);
        await AuthBroker.setToken(credentials, token);
        return token;
    }

    private static async generateToken(data: string): Promise<string> {
        return sign({ data }, SECRET_KEY, { expiresIn: DEFAULT_EXPIRY_TIME });
    }
}
