require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: String
});

const Student = mongoose.model('Student', studentSchema);

app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post('/students', async (req, res) => {
    const { name, age, grade } = req.body;

    const newStudent = new Student({
        name,
        age,
        grade
    });

    await newStudent.save();
    res.json(newStudent);
});

app.delete('/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({message: 'Deleted'});
    }
    catch(err){
        res.status(500).json({message: 'Failed'});
    }
});

app.put('/students/:id', async (req, res) => {
    try {
        const updateStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new: true}
        );
        res.json(updateStudent);
    }
    catch(err){
        res.status(500).json({message: 'Failed'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
