import {client} from "./connection.js";
import CryptoJS from "crypto-js";
import {client as oauth2Client, CLIENT_ID} from '../config.js';

function encrypt_token(token_id, key) {
    var ciphertext = CryptoJS.AES.encrypt(token_id, key);
    return ciphertext.toString();
}

function decrypt_token(ciphertext, key) {
    var bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const getRefreshTokenCollection = () => {
    try
    {
        return client.db('my_notepad').collection('refresh_tokens');
    }
    catch(e) 
    {
        console.log(e.message);
    }
};

function handleError()
{
    if(!client) throw new Error("Not connected to database.");
}

async function getRefreshTokenWithId(_id)
{
    handleError();
    const res = await getRefreshTokenCollection().findOne({_id});
    return res.refreshToken;
}

async function setRefreshToken(_id, refreshToken)
{
    handleError();
    await getRefreshTokenCollection().insertOne({_id, refreshToken});
}

async function updateRefreshToken(_id, refreshToken) {
    handleError();
    await getRefreshTokenCollection().updateOne({ _id }, {$set : {refreshToken}});
}

async function upsertRefreshToken(_id, refreshToken)
{
    handleError();
    const res = await getRefreshTokenWithId(_id);
    if(res)
    {
        updateRefreshToken(_id, refreshToken);
        return;
    }
    setRefreshToken(_id, refreshToken);
}

async function generateNewTokenId(sessionId)
{
    try{
        const refreshToken = await getRefreshTokenWithId(sessionId);
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });
        
        const res = await oauth2Client.refreshAccessToken();
        return res.credentials.id_token;
    }
    catch(e)
    {
        return undefined;
    }
}

async function verifyTokenId(tokenId, sessionId)
{
    try{
        await oauth2Client.verifyIdToken({
            idToken : tokenId,
            audience : CLIENT_ID,
        });
        return tokenId;
    }
    catch(e)
    {
        return generateNewTokenId(sessionId);
    }
}

export default {upsertRefreshToken, encrypt_token, decrypt_token, verifyTokenId};