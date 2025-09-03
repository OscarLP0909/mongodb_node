import dotenv from 'dotenv';
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';


const app = express();
app.use(express.static('public'));
const port = 3000;
dotenv.config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la librería online!');
});

// Ruta para obtener todos los libros
app.get('/libros', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('tiendaLibros');
        const libros = await db.collection('libros').find().toArray();
        res.json(libros);
    } catch (err) {
        res.status(500).send('Error al obtener los libros');
    }
});

// Ruta para crear un libro
app.post('/libros/crear', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('tiendaLibros');
    const nuevoLibro = req.body;
    console.log('Datos recibidos en POST /libros/crear:', nuevoLibro);
        const resultado = await db.collection('libros').insertOne(nuevoLibro);
        res.status(201).json({ mensaje: 'Libro creado', id: resultado.insertedId });
    } catch (err) {
        console.error('Error al crear el libro:', err);
        res.status(500).send('Error al crear el libro');
    }
});

// Ruta para actualizar un libro
app.put('/libros/:id', async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    try {
        await client.connect();
        const db = client.db('tiendaLibros');
        const resultado = await db.collection('libros').updateOne(
            { _id: new ObjectId(id) },
            { $set: datosActualizados }
        );
        if (resultado.matchedCount === 0) {
            return res.status(404).send('Libro no encontrado');
        }
        res.json({ mensaje: 'Libro actualizado' });
    } catch (err) {
        res.status(500).send('Error al actualizar el libro');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
