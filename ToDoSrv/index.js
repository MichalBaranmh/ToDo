const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Polaczono do MongoDB');
});

const todoSchema = new mongoose.Schema({
    nazwa: String,
    status: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/', (req,res)=>{
    res.send('Endpoint nie uzywany');
});

app.get('/todos', async (req,res)=>{
    try{
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error get all failed'})
    }
});

app.listen(port, ()=>{
    console.log(`Server is up port= ${port}`);
});