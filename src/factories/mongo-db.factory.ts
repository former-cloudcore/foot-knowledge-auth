import {Db, MongoClient} from "mongodb";

export class MongoDbFactory {
    private dbs: Record<string, Db> = {};
    private client: MongoClient;

    constructor(connectionUrl: string) {
        this.client = new MongoClient(connectionUrl);
    }

    async getDbByName(dbName: string): Promise<Db> {
        if (!this.isClientConnected()) {
            await this.client.connect();
        }
        this.dbs[dbName] ??= this.client.db(dbName);
        return this.dbs[dbName];
    }

    private isClientConnected(): boolean {
        return !!this.client;
    }
}
