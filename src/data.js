import { fileURLToPath } from 'url'; 
import fs from 'fs'
import path from "path"
// const { ok } = require('assert');
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function initialize() {
    if (!fs.existsSync(path.join(__dirname, "/todayta"))) {
        fs.mkdirSync(path.join(__dirname, "/todayta"));
    }
    if (!fs.existsSync(path.join(__dirname, "/todayta/data.json"))) {
        await fs.promises.writeFile(path.join(__dirname, "/todayta/data.json"), "[]");
    }
}

export function getTodo() {
    return fs.promises.readFile(path.join(__dirname, "/todayta/data.json"))
}

export async function addTodo(todo) {
    let data = JSON.parse(await getTodo())
    data.push(todo)
    return updata(data)
}

export function updata(data) {
    return fs.promises.writeFile(path.join(__dirname, "/todayta/data.json"), JSON.stringify(data));
}

export async function deta(UUID) {
    let data = JSON.parse(await getTodo())
    return updata(data.filter((todo) => todo.id !== UUID))
}

export async function modata(updo) {
    let data = JSON.parse(await getTodo())
    const idx = data.findIndex((todo) => todo.id === updo.id) 
    data[idx] = updo
    return updata(data)
}

// module.exports.initialize = initialize
// module.exports.getTodo = getTodo 
// module.exports.addTodo = addTodo
// module.exports.deta = deta
// module.exports.modata = modata