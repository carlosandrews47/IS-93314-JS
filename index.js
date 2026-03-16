const express = require('express')
const cors = require('cors')
const { sequelize, DataType } =  require('sequelize')

// configuração da conexão com o banco de dados - MySQL.
const sequelize = new sequelize('db_projeto', 'root', '',{
  host: 'localhost',
  dialect: 'mysql'

})  