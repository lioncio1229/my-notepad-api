import { client } from "./connection.js";


const getUsersCollections = () => {
    try
    {
        return client.db('my_notepad').collection('users');
    }
    catch(e) 
    {
        console.log(e);
    }
};

const getUser = async (_id) => {
    if(!client) return;
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
        return user;
    return undefined;
}

const upsetUser = async (user) => {
    if(!client) return;

    const _user = await getUser(user._id);
    if(_user) 
    {
        const updatedUser = await updateUser(user);
        return updatedUser;
    }
    const newUser = await addUser(user);
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