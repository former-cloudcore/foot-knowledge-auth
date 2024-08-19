export const MONGO_URL: string = process.env?.MONGO_URL ?? "mongodb+srv://admin:DgppMTvEeoxaAyTI@auth.nybqpmi.mongodb.net/";
export const AUTH_REPLACE_VALUE: string = 'Bearer ';
export const PORT: number = parseInt(process.env?.MGMT_SERVER_PORT ?? "4000");
export const MONSTER_API_TOKEN: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjhmOTFjYWI3ZWE2OWRjYjFkMTczOTg1ZjhlMDlmYmIwIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDgtMTdUMTc6MzA6MTkuMTMwMzc1In0.O8H0E6koe-Tkh9kEzMdQMMSsuTfm9FO5o47hqdjbrmI"
export const MONSTER_ENDPOINT: string ='https://api.monsterapi.ai/v1/generate/txt2img'
