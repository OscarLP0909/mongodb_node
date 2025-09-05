// db/connection.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export const connectDB = async () => {
    try {
        if (!db) {
            await client.connect();
            db = client.db('tiendaLibros');
            console.log('Conectado a MongoDB');
        }
        return db;
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error;
    }
};

export const closeDB = async () => {
    if (client) {
        await client.close();
        console.log('Conexión MongoDB cerrada');
    }
};

export { db };