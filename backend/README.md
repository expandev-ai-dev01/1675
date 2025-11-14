# NoteDB Backend API

Sistema minimalista para gerenciamento de notas com banco de dados SQL Server.

## Tecnologias

- Node.js
- TypeScript
- Express.js
- MS SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Utilitários
├── config/           # Configurações
└── server.ts         # Ponto de entrada
```

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações de banco de dados.

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## Endpoints da API

### Health Check
- `GET /health` - Verifica o status da API

### Notas (a serem implementados)
- `GET /api/v1/internal/note` - Lista todas as notas
- `POST /api/v1/internal/note` - Cria uma nova nota
- `GET /api/v1/internal/note/:id` - Obtém uma nota específica
- `PUT /api/v1/internal/note/:id` - Atualiza uma nota
- `DELETE /api/v1/internal/note/:id` - Exclui uma nota

## Estrutura de Resposta

### Sucesso
```json
{
  "success": true,
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Segurança

- Helmet para headers de segurança
- CORS configurável
- Validação de entrada com Zod
- Multi-tenancy com isolamento por conta

## Licença

ISC