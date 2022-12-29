import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const {MONGODB_USERNAME, MONGODB_PASSWORD} = process.env;
const url = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ketws38.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(url);

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
        console.log(e.message);
    }
}