const express = require('express')
const { Client } = require("pg")
const cors = require("cors")
const fs = require("fs");
require('dotenv').config();

const PORT = process.env.PORT || 3005

let client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

client.connect()

let app = express()
app.use(cors())
app.use(express.json())

// client.query("DROP TABLE students;")

// client.query("CREATE TABLE student (id SERIAL PRIMARY KEY , username VARCHAR(40) UNIQUE, password VARCHAR(40) , email VARCHAR(40), avatar TEXT);")
// client.query("CREATE TABLE students (student_id INT, id INT);")

// client.query("CREATE TABLE students (student_id INT, id INT);")

// console.log(fs.readFileSync("database.sql"))

// fs.readFile("database.sql", 'utf8', (err, data) => {
//     let querys = data

//     querys = querys.split("\n")

//     // console.log(querys)

//     querys.forEach(query => {
//         try {
//             console.log(query.replace("\r", ""))
    
//             client.query(query.replace("\r", ""))
            
//         } catch (error) {
//             console.error(error)
//         }
//     })
// })

app.get("/api/v1/teacher/:username/:password", async (req, res) => {

    try {
        let { username, password } = req.params
        let response = {}

        let account = await (await client.query("SELECT * FROM teacher WHERE username = $1;", [
            username
        ])).rows

        if (account.length > 0){
            if (account[0].password === password){
                response.accountexists = true
                response.success = true
                response.account = account[0]
            }
        } else {
            response.success = false
        }

        response.error = false

        res.json(
            response
        )
    } catch (error) {
        res.json({
            success: false,
            error: true,
            accountexists: false,
            account: {}
        })
    }
})

app.post("api/v1/teacher/:username/:password/:email/:avatar", async (req, res) => {

    try {
        let { username, password, email, avatar } = req.params

        let account = await (await client.query("INSERT INTO teacher (username, password, email, avatar) VALUES ($1, $2, $3, $4);", [
            username,
            password,
            email,
            avatar
        ])).rows[0]

        res.json({
            success: true,
            error: false,
            account: account
        })
    } catch (error) {
        res.json({
            success: false,
            error: true,
            account: {}
        })        
    }
})

app.get("/api/v1/student/:username/:password", async (req, res) => {

    try {
        let { username, password } = req.params
        let response = {}

        let account = await (await client.query("SELECT * FROM student WHERE username = $1;", [
            username
        ])).rows

        if (account.length > 0){
            if (account[0].password === password){
                response.accountexists = true
                response.success = true
                response.account = account[0]
            }
        } else {
            response.success = false
        }

        response.error = false

        res.json(
            response
        )
    } catch (error) {
        res.json({
            success: false,
            error: true,
            accountexists: false,
            account: {}
        })
    }
})

app.post("api/v1/student/:username/:password/:email/:avatar", async (req, res) => {

    try {
        let { username, password, email, avatar } = req.params

        let account = await (await client.query("INSERT INTO student (username, password, email, avatar) VALUES ($1, $2, $3, $4);", [
            username,
            password,
            email,
            avatar
        ])).rows[0]

        res.json({
            success: true,
            error: false,
            account: account
        })
    } catch (error) {
        res.json({
            success: false,
            error: true,
            account: {}
        })        
    }
})

app.post("api/v1/class", async (req, res) => {

    try {
        
        let { students, teachers } = req.body

        students.forEach(student => {
            // await client.query("INSERT INTO ")
        })

    } catch (error) {
        
    }
})

app.get("/query", async (req, res) => {

    try {

        client.query(req.body.query)
        
    } catch (error) {
        console.error(error)

        res.json({
            error: true
        })
    }
})

// client.query("CREATE TABLE student (id SERIAL PRIMARY KEY, username VARCHAR(40) UNIQUE, password VARCHAR(40), email VARCHAR(40) UNIQUE, avatar TEXT);")