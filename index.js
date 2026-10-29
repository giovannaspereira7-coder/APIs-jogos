const express = require("express")
const mysql = require("mysql2/promise")
const app = express()


app.use(express.json())

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "jogos",
    waitForConnections: true
})

app.get("/jogos", async (req, res)=>{
    const [jogos] = await pool.execute ("select * from game")
    return res.json(jogos)
}) 

app.post("/jogos", async (req, res)=>{
    const {nome, desenvolvedora, sinopse, genero_id} = req.body

    if(!nome || !desenvolvedora || !sinopse || !genero_id){
        return res.status(400).json ({error: "Nome, desenvolvedora e sinopse são campos obrigatórios!"})
    }

    if(nome.length < 3){
        return res.status(400).json({error: "Nome é necessario ter mais de 3 caracteres!"})
    }
    const [resultado] = await pool.execute(
        "INSERT INTO game (nome, desenvolvedora, sinopse, genero_id) VALUES (?, ?, ?, ?)",
        [nome, desenvolvedora,sinopse, genero_id]
    )

    return res.status(201).json ({id: resultado.insertId, nome, desenvolvedora, sinopse, genero_id})
})

app.put("/jogos/:id", async (req, res) => {
    const {nome, desenvolvedora, sinopse, genero_id} = req.body

    if(! nome || !desenvolvedora || !sinopse || !genero_id){
        res.status(400).json({error: "Nome, desenvolvedora e sinopse são campos obrigatórios!"})
    }
    const id = req.params.id

    const [resultado] = await pool.execute(
        "UPDATE game SET nome = ?, desenvolvedora = ?, sinopse = ?, genero_id = ? WHERE id = ?",
        [nome,desenvolvedora,sinopse, genero_id, id]
    )
    
    if(resultado.affectedRows === 0){
        return res.status(400).json({error: "Jogo não encontrado"})
    }

    return res.json({ id, nome, desenvolvedora, sinopse, genero_id})
})

app.delete("/jogos/:id", async (req, res)=>{
    const id = req.params.id

    const [resultado] =await pool.execute(
        "delete from game where id = ?",
        [id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({error: "Jogo não encontrado!"})
    }

    return res.status(204).end()
})

const jogos = [
    { id: 1, nome: "Roblox" },
    { id: 2, nome: "Minecraft" }
]

app.get("/jogos/:id", (req, res)=>{
    const idinformado = req.params.id

    const jogo = jogos.find(
        li => li.id === Number(idinformado)
    )

    if(!jogo){
        return res.status(404).json({error: "Jogo não encontrado!"})
    }
    res.json(jogo)
})

app.get("/genero", async (req, res)=>{
       const[generos] = await pool.execute ("select * from genero")
       return res.json(generos)
})

app.post("/genero", async (req, res)=>{
    const {nome, descricao} = req.body

    if(!nome || !descricao){
        return res.status(400).json({error: "Nome e descrição são campos obrigatórios!"})
    }

    if(nome.length <3){
        return res.status(400).json ({error: "Nome e descrição deve conter mais de 3 caracteres"})
    }
    const [resultado]= await pool.execute(
        "INSERT INTO genero (nome, descricao) VALUES (?, ?)",
        [nome, descricao]
    )
    return res.status(201).json({id: resultado.insertId, nome, descricao})
})
 




app.listen(3000, () => console.log("API no ar"))
