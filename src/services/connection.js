import { MongoClient } from "mongodb";

const password = encodeURIComponent('#Ironman_12#')
const uri = `mongodb+srv://lioncio1229:${password}@cluster0.thlbipo.mongodb.net/?retryWrites=true&w=majority`;

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