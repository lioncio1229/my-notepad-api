import { client } from "./connection.js";


function handleError(googleId)
{
    if(!client) throw new Error("Not connected to database.");
    if(!googleId) throw new Error("Google Id is undefined.");
}

export const getUsersCollections = () => {
    try
    {
        return client.db('my_notepad').collection('users');
    }
    catch(e) 
    {
        console.log(e.message);
    }
};

const getUser = async (_id) => {
    handleError(_id);
    
    return await getUsersCollections().findOne({_id});
}

const addUser = async (user) => {
    if(!client) return;

    await getUsersCollections().insertOne(user);
    return user;
}

const updateUser = async (user) => {
    if(!client) return;

    const filter = { _id : user._id }
    const updateDoc = {
        $set : {...user, _id : user._id}
    };

    const result = await getUsersCollections().updateOne(filter, updateDoc);
    
    if(result.matchedCount > 0) 
        return await getUser(user._id);
    return undefined;
}

const upsetUser = async (user) => {
    if(!client) return;

    const _user = await getUser(user._id);
    if(_user) 
    {
        return await updateUser(user);
    }
    const newUser = await addUser({...user, notes : []});
    return newUser;
}

const deleteUser = async (_id) => {
    if(!client) return;

    const result = await getUsersCollections().deleteOne({_id});
    if(result.deletedCount > 0) return _id;
    return undefined;
}

const deleteAll = async () => {
    if(!client) return;

    await getUsersCollections().deleteMany({});
};

export default {getUsersCollections, getUser, addUser, updateUser, upsetUser, deleteUser, deleteAll};