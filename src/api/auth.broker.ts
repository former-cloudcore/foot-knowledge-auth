import {MongoDBModule} from "../modules/mongo.module";
import {DBName} from "../enums/DB-name.enum";
import {CollectionName} from "../enums/collection-name.enum";
import {CredentialsDTO, UserDTO} from "../dto/auth/user.dto";

export class AuthBroker {

    static async getUser(email: string): Promise<UserDTO> {
        return await MongoDBModule.getInstance().getOne(DBName.AUTH_DB, CollectionName.USERS, {'credentials.email': email});
    }

    static async setToken(credentials: CredentialsDTO, token: string): Promise<boolean> {
        return await MongoDBModule.getInstance().setField(DBName.AUTH_DB, CollectionName.USERS, {'credentials.email': credentials.email}, { token });
    }

    static async validateToken(token: string): Promise<boolean> {
        let user;
        try {
            user = await MongoDBModule.getInstance().getOne(DBName.AUTH_DB, CollectionName.USERS, {'token': token});
        } catch (error) {
            console.error(error);
        }
        return !!user;
    }

    static async logout(token: string): Promise<boolean> {
        return await MongoDBModule.getInstance().setField(DBName.AUTH_DB, CollectionName.USERS, { token }, { token: null });
    }

    static async createUser(user: UserDTO): Promise<void> {
        await MongoDBModule.getInstance().insertOne(DBName.AUTH_DB, CollectionName.USERS, user);
    }
}
