const app = require('./app');

const PORT = process.env.PORT || 4020; // Porta agora é 4040

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
