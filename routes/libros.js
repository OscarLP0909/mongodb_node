import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('tiendaLibros');
        const libros = await db.collection('libros').find().toArray();
        res.json(libros);
    } catch (err) {
        res.status(500).send('Error al obtener los libros');
    }
});

// Crear un libro
router.post('/crear', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('tiendaLibros');
        const nuevoLibro = req.body;
        const resultado = await db.collection('libros').insertOne(nuevoLibro);
        res.status(201).json({ mensaje: 'Libro creado', id: resultado.insertedId });
    } catch (err) {
        res.status(500).send('Error al crear el libro');
    }
});

// Actualizar un libro
router.put('/:id', async (req, res) => {
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

export default router;