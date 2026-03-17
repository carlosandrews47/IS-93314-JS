

  const express = require('express')
const cors = require('cors')
const { Sequelize, DataTypes } = require('sequelize') // CORREÇÃO: Sequelize (maiúsculo) e DataTypes

// configuração da conexão com o banco de dados - MySQL.
const sequelize = new Sequelize('db_projeto', 'root', '', { // CORREÇÃO: Sequelize (maiúsculo)
    host: 'localhost',
    dialect: 'mysql'
})

// Testar a conexão (opcional, mas recomendado)
sequelize.authenticate()
    .then(() => {
        console.log('Conectado ao banco de dados com sucesso!')
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco:', err)
    })

const Cliente = sequelize.define('Cliente', { 
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: {
        type: DataTypes.STRING
    }
})

// Sincronizar com o banco de dados (cria a tabela se não existir)
sequelize.sync()
    .then(() => {
        console.log('Tabelas sincronizadas com o banco de dados')
    })
    .catch(err => {
        console.error('Erro ao sincronizar tabelas:', err)
    })

// CONFIGURAÇÃO DO SERVIDOR EXPRESS.
const app = express()
app.use(cors()) // permite o front acessar a API 
app.use(express.json()) // permite o servidor a atender json

const port = 3001

// Definição de rotas (endpoints)
app.get('/clientes', async(req, res) => { // CORREÇÃO: /clientes (minúsculo) para manter padrão
    try {
        const todosOsClientes = await Cliente.findAll()
        res.json({
            success: true,
            data: todosOsClientes
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar clientes',
            error: error.message
        })
    }
})

// Rota para criar um novo cliente
app.post('/clientes', async(req, res) => {
    try {
        const { nome, email, telefone } = req.body
        
        // Validação básica
        if (!nome || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nome e email são obrigatórios'
            })
        }

        const novoCliente = await Cliente.create({ nome, email, telefone })
        
        res.status(201).json({
            success: true,
            message: 'Cliente criado com sucesso',
            data: novoCliente
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erro ao criar cliente',
            error: error.message
        })
    }
})

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})



