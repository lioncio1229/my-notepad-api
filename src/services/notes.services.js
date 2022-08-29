import {client} from "./connection.js";
import { ObjectId } from "mongodb";

const getNoteCollections = () => {
    try
    {
        return client.db('my_notepad').collection('notes');
    }
    catch(e) 
    {
        console.log(e);
    }
};

const getNotes = async () => {
    if(!client) return;
    const cursor = getNoteCollections().find();
    return await cursor.toArray(); 
};

const getNote = async (id) => {
    if(!client) return;
    return await getNoteCollections().findOne({_id : ObjectId(id)});
}

const addNote = async (note) => {
    if(!client) return;

    await getNoteCollections().insertOne(note);
    return note;
}

const deleteNote = async (id) => {
    if(!client) return;

    const result = await getNoteCollections().deleteOne({_id : ObjectId(id)});
    if(result.deletedCount > 0) return id;
    return undefined;
}

const deleteAll = async () => {
    if(!client) return;

    await getNoteCollections().deleteMany({});
};

const updateNote = async (updatedNote) => {
    if(!client) return;

    const filter = { _id : ObjectId(updatedNote._id) }
    const updateDoc = {
        $set : {...updatedNote, _id : ObjectId(updatedNote._id)}
    };

    const result = await getNoteCollections().updateOne(filter, updateDoc);

    if(result.matchedCount > 0)
        return updatedNote;
    return undefined;
}

export default {getNote, getNotes, addNote, updateNote, deleteNote, deleteAll};