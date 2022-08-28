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

    await getNoteCollections().deleteOne({_id : ObjectId(id)});
    return id;
}

const updateNote = async (updatedNote) => {
    if(!client) return;

    const updatedNoteCopy = {...updatedNote};
    delete updatedNoteCopy.id;

    const filter = { _id : ObjectId(updatedNote.id) }
    const updateDoc = {
        $set : {...updatedNoteCopy, _id : ObjectId(updatedNote.id)}
    };

    await getNoteCollections().updateOne(filter, updateDoc);
    return updatedNote;
}

export default {getNote, getNotes, addNote, updateNote, deleteNote};