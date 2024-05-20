const express = require("express")
const app = express()
const uuid = require('uuid')

app.use(express.json())

const port = 3000
const pedidos = []

//MIDDLEWARES
const pegarId = (req, res, next) => {
    const {id} = req.params 
    const {order, clientName, price, status} = req.body

    const pedidosIndex = pedidos.findIndex(pedido => pedido.id === id)

    if (pedidosIndex === -1) {
        return res.status(404).json({ message: '[ERRO!] Pedido não encontrado' })
    }

    req.pedidosIndex = pedidosIndex
    req.NovoPedido = { id, order, clientName, price, status }

    next()
}

const mostrarRequisicaoeURL = (req, res, next) => {
    console.log(`[${req.method}] - ${req.url}`)
    next()
}
app.use(mostrarRequisicaoeURL) //funciona em todas as rotas.

//ROTAS
app.get('/order', (req, res) => {
    return res.json(pedidos)
})

//rota get para pegar um pedido específico
app.get('/order/:id', pegarId, (req, res) => {
    const { pedidosIndex } = req
    const { id } = req.params
    
    return res.json(pedidos[pedidosIndex])
})

app.post('/order', (req,res) => {
    const {order, clientName, price, status} = req.body
    const pedido = {id:uuid.v4(), order, clientName, price, status}

    pedidos.push(pedido)

    return res.status(201).json(pedidos)
})

//Rota para atualizar o pedido
app.put('/order/:id', pegarId, (req,res ) => { 
    const { NovoPedido, pedidosIndex } = req
    const { id } = req.params

    pedidos[pedidosIndex] = NovoPedido

    return res.json(NovoPedido) 
})

//Pedido pronto
app.patch('/order/:id', pegarId, (req, res) => {
    const { pedidosIndex } = req
    const { id } = req.params

    //combinar o pedido antigo com mudanças atuais.
    const pedidoPronto = {
        ...pedidos[pedidosIndex],
        ...req.body,
    }
    pedidos[pedidosIndex] = pedidoPronto

    return res.json(pedidoPronto)
})

app.delete('/order/:id', pegarId, (req, res) => {
    const { pedidosIndex } = req
    pedidos.splice(pedidosIndex, 1) 
    return res.status(204).send()
})

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`)
})

