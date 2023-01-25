import { OAuth2Client } from 'google-auth-library';
import usersServices from '../services/users.services.js';
import oauthServices from '../services/oauth.services.js';
import dotenv from "dotenv";

dotenv.config();

const {CLIENT_ID, CLIENT_SECRET, AUTH_SECRETH_KEY} = process.env;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, 'postmessage');

async function authenticate(req, res)
{
    try{
        const {authCode} = req.body;
        const result = await client.getToken(authCode);
        client.setCredentials(result.tokens);

        const {refresh_token, id_token} = result.tokens;

        const ticket = await client.verifyIdToken({
            idToken : id_token,
            audience : CLIENT_ID,
        });

        const {sub : _id, name, email, picture} = ticket.getPayload();
        await oauthServices.upsertRefreshToken(_id, refresh_token);
        req.session._id = _id;
        
        await usersServices.upsetUser({_id, name, email, picture});
        res.send(id_token);
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
}

async function validateToken(req, res)
{
    try{
        const {authorization} = req.headers;
        if(authorization)
        {
            const tokenId = authorization.split(' ')[1];
            const validatedTokenId = await oauthServices.verifyTokenId(client, tokenId, CLIENT_ID, req.session._id);

            if(!validatedTokenId)
            {
                throw new Error('Validation Failed');
            }
            res.send(validatedTokenId);
            return;
        }
        throw new Error('Authorization required');
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
}

export default {authenticate, validateToken};