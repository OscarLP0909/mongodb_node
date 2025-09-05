import dotenv from 'dotenv';
import express from 'express';
import librosRouter from './routes/libros.js';
import { connectDB } from './db/connection.js';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
await connectDB();
app.use(express.static('public'));
app.use(express.json());

app.use('/libros', librosRouter);

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la librería online!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});