import { db, Table } from '../config/db.config.js';
import { DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const createOrUpdate = async (event) => {

    try {

        const requestBody = event;
        const params = {
            TableName: Table,
            Item: marshall(requestBody || {})
        }

        const response = await db.send(new PutItemCommand(params));

        console.log(response);

        return { success: true }

    } catch (error) {
        console.log(error)
        return { success: false, error: error }
    }
}

const readAllUsers = async () => {

    const params = {
        TableName: Table
    }

    try {
        const { Items } = await db.send(new ScanCommand(params))
        const users = (Items) ? Items.map((item) => unmarshall(item)) : {}
        return { success: true, data: users }

    } catch (error) {
        console.log(error)
        return { success: false, data: null }
    }

}

const getUserById = async (userId) => {
    const params = {
        TableName: Table,
        Key: marshall({ id:  userId})
    }

    try {

        const { Item } = await db.send(new GetItemCommand(params))
        const user = (Item) ? unmarshall(Item) : {};

        return { success: true, data: user };

    } catch (error) {
        console.log(error)
        return { success: false, data: null }
    }
}

const deleteUserById = async (userId) => {
    const params = {
        TableName: Table,
        Key: marshall({ id: userId })
    }

    try {
        const { Item } = await db.send(new DeleteItemCommand(params))
        
        const deleteUser = (Item) ? unmarshall(Item) : {};

        console.log("User deleted --> ", deleteUser)

        return { success: true }

    } catch (error) {
        console.log(error)
        return { success: false }
    }
}

export {
    createOrUpdate,
    readAllUsers,
    getUserById,
    deleteUserById
}