import {client} from "./connection.js";
import CryptoJS from "crypto-js";

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
    return await getRefreshTokenCollection().findOne({_id});
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

async function generateNewTokenId(client, sessionId)
{
    try{
        const refreshToken = await getRefreshTokenWithId(sessionId);
        const token = await client.getToken({refresh_token : refreshToken});
        return token.id_token;
    }
    catch(e)
    {
        return undefined;
    }
}

async function verifyTokenId(client, tokenId, clientId, sessionId)
{
    try{
        await client.verifyIdToken({
            idToken : tokenId,
            audience : clientId,
        });
        return tokenId;
    }
    catch(e)
    {
        return generateNewTokenId(client, sessionId);
    }
}

export default {upsertRefreshToken, encrypt_token, decrypt_token, verifyTokenId};