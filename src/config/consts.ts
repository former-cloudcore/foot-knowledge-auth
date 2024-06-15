export const MONGO_URL: string = process.env?.MONGO_URL ?? "mongodb+srv://admin:DgppMTvEeoxaAyTI@auth.nybqpmi.mongodb.net/";
export const AUTH_REPLACE_VALUE: string = 'Bearer ';
export const PORT: number = parseInt(process.env?.MGMT_SERVER_PORT ?? "4000");
