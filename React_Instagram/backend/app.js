// utilizado para separar a configuração do servidor
require("dotenv").config()

const express = require("express")
const path = require("path")
const cors = require("cors")

// chamando a porta pelo .env
const port = process.env.PORT;

const app = express()

// config JSON and form data response
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Solve Cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))

// Diretorio de Upload 
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Conexão DB
require("./config/db.js")

// definindo as rotas através da pasta routes
const router = require("./routes/Router.js")

app.use(router)

// rodando o servidor na porta definida
app.listen(port, () => {
    console.log(`App rodando a porta: ${port}`)
})