import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const env = process.env;
const uri = `mongodb+srv://${env.mongodb_username}:${env.mongodb_password}@cluster0.ketws38.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(uri);

export default async function connect()
{
    try
    {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected!');
    }
    catch(e)
    {
        console.log(e);
    }
}