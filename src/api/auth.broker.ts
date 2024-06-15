import { MongoDBModule } from "../modules/mongo.module";
import { DBName } from "../enums/DB-name.enum";
import { CollectionName } from "../enums/collection-name.enum";
import { CredentialsDTO, UserDTO } from "../dto/auth/user.dto";
import { singleton } from "../decorators/singleton.decorator";

@singleton
export class AuthBroker {
    async getUser(email: string): Promise<UserDTO> {
        return await new MongoDBModule().getOne(DBName.AUTH_DB, CollectionName.USERS, {'credentials.email': email});
    }

    async setToken(credentials: CredentialsDTO, token: string): Promise<boolean> {
        return await new MongoDBModule().setField(DBName.AUTH_DB, CollectionName.USERS, {'credentials.email': credentials.email}, { token });
    }

    async validateToken(token: string): Promise<boolean> {
        const user = await new MongoDBModule().getOne(DBName.AUTH_DB, CollectionName.USERS, { 'token': token });
        return !!user;
    }

    async logout(token: string): Promise<boolean> {
        return await new MongoDBModule().setField(DBName.AUTH_DB, CollectionName.USERS, { token }, { token: null });
    }

    async createUser(user: UserDTO): Promise<void> {
        await new MongoDBModule().insertOne(DBName.AUTH_DB, CollectionName.USERS, user);
    }
}
