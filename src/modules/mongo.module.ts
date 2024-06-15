import {Collection, Db, UpdateResult, InsertOneResult, Document} from 'mongodb';
import {MONGO_URL} from "../config/consts";
import {DBName} from "../enums/DB-name.enum";
import {CollectionName} from "../enums/collection-name.enum";
import {MongoDbFactory} from "../factories/mongo-db.factory";

export class MongoDBModule {

    private dbFactory: MongoDbFactory;
    private static instance: MongoDBModule;

    constructor() {
        this.dbFactory = new MongoDbFactory(MONGO_URL);
    }

    static getInstance() {
        this.instance ??= new MongoDBModule();
        return this.instance
    }

    async getAll(dbName: DBName, collectionName: CollectionName): Promise<any[]> {
        let all: any[] = [];
        try {
            const collectionRef: Collection<Document> = await this.getCollectionRef(dbName, collectionName) as Collection<Document>;
            if (!!collectionRef) {
                all.push(...(await collectionRef.find({}).toArray()));
            }
        } catch (error) {
            console.error(error);
        }
        return all;
    }

    async getOne(dbName: DBName, collectionName: CollectionName, where: any): Promise<any> {
        let returnValue = null;
        try {
            const collectionRef: Collection<Document> | null = await this.getCollectionRef(dbName, collectionName);
            if (collectionRef) {
                returnValue = await collectionRef.findOne(where);
            }
        } catch (error) {
            console.error(error);
        }
        return returnValue;
    }

    async setField(dbName: DBName, collectionName: CollectionName, where: any, set: any): Promise<boolean> {
        let success: boolean = false;
        try {
            const collectionRef: Collection<Document> | null = await this.getCollectionRef(dbName, collectionName);
            const updateResult: UpdateResult<Document> | undefined = await collectionRef?.updateOne(
                where,
                {$set: set}
            );
            success = updateResult?.modifiedCount === 1;
        } catch (error) {
            console.error(error)
        }
        return success;
    }

    async insertOne(dbName: DBName, collectionName: CollectionName, document: any): Promise<boolean> {
        let success: boolean = false;
        try {
            const collectionRef: Collection<Document> | null = await this.getCollectionRef(dbName, collectionName);
            const insertResult: InsertOneResult<Document> | undefined = await collectionRef?.insertOne(document);
            success = insertResult?.acknowledged === true;
        } catch (error) {
            console.error(error);
        }
        return success;
    }

    private async getCollectionRef(dbName: DBName, collectionName: CollectionName): Promise<Collection<Document> | null> {
        try {
            return (await this.getDbByName(dbName)).collection(collectionName);
        } catch (error: any) {
            console.log(`getCollectionRef error fetching collection: ${collectionName} from db: ${dbName}: `, error.stack);
            return null;
        }
    }

    private async getDbByName(dbName: string): Promise<Db> {
        return await this.dbFactory.getDbByName(dbName);
    }
}
