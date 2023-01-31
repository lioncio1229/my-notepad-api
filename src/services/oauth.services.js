import {client} from "./connection.js";
import CryptoJS from "crypto-js";
import {client as oauth2Client, CLIENT_ID, AUTH_SECRET_KEY} from '../config.js';

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
    return res?.refreshToken;
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

async function setTokenId(_id, tokenId)
{
    handleError();
    await getRefreshTokenCollection().updateOne({_id}, {$set : {tokenId}});
}

async function getTokenId(_id)
{
    handleError();
    const res = await getRefreshTokenCollection().findOne({_id});
    return res?.tokenId;
}

async function blaclistEncryptedToken(_id, encryptedToken)
{
    handleError();
    await getRefreshTokenCollection().updateOne({_id}, {$push : {blacklistedEncryptedToken : encryptedToken}});
}

async function isBlacklisted(_id, encryptedToken)
{
    handleError();
    const user = await getRefreshTokenCollection().findOne({_id});
    if(!user) throw new Error("Can't find user");

    const val = (user.blacklistedEncryptedToken || []).includes(encryptedToken);
    return val;
}

async function generateNewTokenId(sessionId)
{
    try{
        const refreshToken = await getRefreshTokenWithId(sessionId);
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });
        
        const res = await oauth2Client.refreshAccessToken();
        const {id_token} = res.credentials;
        await setTokenId(sessionId, id_token);
        return id_token;
    }
    catch(e)
    {
        return undefined;
    }
}

async function verifyTokenId(encryptedTokenId, sessionId)
{
    const val = await isBlacklisted(sessionId, encryptedTokenId);
    if(val) return undefined;
    
    const _tokenId = await getTokenId(sessionId);
    const tokenId = decrypt_token(encryptedTokenId, AUTH_SECRET_KEY);

    if(_tokenId && _tokenId !== tokenId) return undefined;

    await blaclistEncryptedToken(sessionId, encryptedTokenId);

    try{
        await oauth2Client.verifyIdToken({
            idToken : tokenId,
            audience : CLIENT_ID,
        });
        await setTokenId(sessionId, tokenId);
        return tokenId;
    }
    catch(e)
    {
        return generateNewTokenId(sessionId);
    }
}

export default {upsertRefreshToken, verifyTokenId};