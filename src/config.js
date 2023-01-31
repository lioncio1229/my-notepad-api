import { OAuth2Client } from 'google-auth-library';
import dotenv from "dotenv";

dotenv.config();

const {CLIENT_ID, CLIENT_SECRET, AUTH_SECRET_KEY} = process.env;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, 'postmessage');

export {client, CLIENT_ID, AUTH_SECRET_KEY};
