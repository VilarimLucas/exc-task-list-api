const taskController = require('../controllers/taskController');
const { Task } = require('../models');

// Mock das funções do modelo Task para evitar interação com o banco de dados real
jest.mock('../models', () => ({
  Task: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Função auxiliar para simular a resposta HTTP
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes do controlador de tarefas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Cadastro de tarefa', () => {
    it('Deve cadastrar uma nova tarefa com sucesso e retornar status 201', async () => {
      const req = { body: { description: 'Nova Tarefa', isCompleted: false } };
      const res = mockResponse();
      const tarefaCriada = { id: 1, description: 'Nova Tarefa', isCompleted: false };

      Task.create.mockResolvedValue(tarefaCriada);

      await taskController.addTask(req, res);

      expect(Task.create).toHaveBeenCalledWith({ description: 'Nova Tarefa', isCompleted: false });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(tarefaCriada);
    });

    it('Deve retornar erro 500 se ocorrer um problema ao cadastrar a tarefa', async () => {
      const req = { body: { description: 'Nova Tarefa', isCompleted: false } };
      const res = mockResponse();

      Task.create.mockRejectedValue(new Error('Erro no banco de dados'));

      await taskController.addTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding task',
        error: 'Erro no banco de dados',
      });
    });
  });

  describe('Buscar tarefa por ID', () => {
    it('Deve retornar a tarefa pelo ID com sucesso', async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const tarefa = { id: 1, description: 'Tarefa Exemplo', isCompleted: false };

      Task.findByPk.mockResolvedValue(tarefa);

      await taskController.getTaskById(req, res);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(tarefa);
    });

    it('Deve retornar erro 404 se a tarefa não for encontrada', async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();

      Task.findByPk.mockResolvedValue(null);

      await taskController.getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('Listar todas as tarefas', () => {
    it('Deve retornar uma lista de tarefas com sucesso', async () => {
      const req = {};
      const res = mockResponse();
      const tarefas = [{ id: 1, description: 'Tarefa 1', isCompleted: false }];

      Task.findAll.mockResolvedValue(tarefas);

      await taskController.getAllTasks(req, res);

      expect(Task.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(tarefas);
    });
  });

  describe('Atualizar tarefa', () => {
    it('Deve atualizar uma tarefa com sucesso', async () => {
      const req = { params: { id: 1 }, body: { description: 'Tarefa Atualizada', isCompleted: true } };
      const res = mockResponse();
      const tarefa = { id: 1, update: jest.fn().mockResolvedValue() };

      Task.findByPk.mockResolvedValue(tarefa);

      await taskController.updateTask(req, res);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(tarefa.update).toHaveBeenCalledWith({ description: 'Tarefa Atualizada', isCompleted: true });
      expect(res.json).toHaveBeenCalledWith(tarefa);
    });

    it('Deve retornar erro 404 se a tarefa a ser atualizada não for encontrada', async () => {
      const req = { params: { id: 1 }, body: { description: 'Tarefa Atualizada', isCompleted: true } };
      const res = mockResponse();

      Task.findByPk.mockResolvedValue(null);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('Deletar tarefa', () => {
    it('Deve deletar uma tarefa com sucesso', async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const tarefa = { id: 1, destroy: jest.fn().mockResolvedValue() };

      Task.findByPk.mockResolvedValue(tarefa);

      await taskController.deleteTask(req, res);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(tarefa.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('Deve retornar erro 404 se a tarefa a ser deletada não for encontrada', async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();

      Task.findByPk.mockResolvedValue(null);

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });
});
