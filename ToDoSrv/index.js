const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
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

const Todo = mongoose.model("Todo", todoSchema);

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

app.post('/todos', async(req, res)=>{
    try{
        const newTodo = new Todo({
            nazwa: req.body.nazwa,
            status: false,
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch(error){
        res.status(500).json({ error: 'Error failed to post'})
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
        return res.status(404).json({ error: 'ID not found' });
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Server failed to respond' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
        return res.status(404).json({ error: 'ID not found' });
        }
        res.json(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server failed to respond' });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndupdate(req.params.id,{
            nazwa: req.body.nazwa,
            status: req.body.status,
        },{new: true}
    );
        if (!updatedTodo) {
        return res.status(404).json({ error: 'ID not found' });
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Server failed to respond' });
    }
});

app.listen(port, ()=>{
    console.log(`Server is up port= ${port}`);
});