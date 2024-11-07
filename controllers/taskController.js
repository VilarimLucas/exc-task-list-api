const { Task } = require('../models');

// Adicionar uma nova task
exports.addTask = async (req, res) => {
    try {
        const { description, isCompleted } = req.body;
        const task = await Task.create({ description, isCompleted, });
        res.status(201).json(task);
    } catch (error) {
        console.error('Error adding task:', error); // Log do erro no console
        res.status(500).json({ message: 'Error adding task', error: error.message });
    }
};


// Buscar task por ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
};

// Listar todas as tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// Atualizar uma task
exports.updateTask = async (req, res) => {
    try {
        const { description, isCompleted } = req.body;
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.update({ description, isCompleted });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

// Deletar uma task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};
