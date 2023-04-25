import express from 'express'
import {initialize, getTodo, addTodo, deta, modata} from './data.js'
import bodyParser from "body-parser"
import {randomUUID} from "crypto"
import {engine} from "express-handlebars"
const app = express()
const port = 3000 

initialize()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// app.set('views', './src/views');


app.use(express.static("public"))
// app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  let todo = {"todos": JSON.parse(await getTodo())}
  res.render("home", todo)
})

app.get('/all', async(req, res) => {
  res.json({"todos": JSON.parse(await getTodo())})
})

app.post('/create', async (req, res) => {
  console.log(req.body)
  const {todo, date} = req.body
  const id = randomUUID()
  await addTodo({
    "todo": todo,
    "date": date,
    "id": id
  }) 
  res.set("Created-Location", `http://localhost:3000/${id}`)
  res.redirect("/")
})

app.put('/update', async (req, res) => {
  const {todo, date, id} = req.body
  await modata({
    "todo": todo,
    "date": date,
    "id": id
  }) 
  
  res.redirect("/") 
})

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  await deta(id) 
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`Hosted at: http://localhost:3000`)
})
