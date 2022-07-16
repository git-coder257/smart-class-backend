const express = require('express');
let app = express()

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});
// var compressjs = require('compressjs');
let compress = require("./compress").compress 
const { Client } = require("pg")
const cors = require("cors")
let { verify } = require("jsonwebtoken");
require('dotenv').config();

let teacher_post = require("./api/v1/post/teacher").teacher
let teacher_get = require("./api/v1/get/teacher").teacher

let student_get = require("./api/v1/get/student").student
let student_post = require("./api/v1/post/student").student

let lesson_post = require("./api/v1/post/lesson").lesson
let lesson_get = require("./api/v1/get/lesson").lesson
let lesson_put = require("./api/v1/put/lesson").lesson
let lesson_delete = require("./api/v1/delete/lesson").lesson
let lessons_get = require("./api/v1/get/lessons").lessons

let timetable_post = require("./api/v1/post/timetable").timetable
let timetables_get = require("./api/v1/get/timetables").timetables

let school_post = require("./api/v1/post/school").school
let school_get = require("./api/v1/get/school").school

let email_get = require('./api/v1/get/email').email

const handlegetaccountid = async (accounttype, username) => {
    try {
        let id = await (await client.query(`SELECT id FROM ${accounttype} WHERE username = $1;`, [
            username
        ])).rows[0].id

        return id
    } catch (error) {
        console.error(error)
    }
}

let socket_ids = new Map()

io.on("connection", socket => {
    let username
    let accounttype = "student"
    let disconnected = false

    console.log(socket.handshake.auth.key)
    try {
        let account = verify(socket.handshake.auth.key, process.env.ACCESS_TOKEN_SECRET)
        console.log(account)
        username = account.username

        client.query("SELECT * FROM student WHERE username = $1;", [
            account.username
        ], (err, result) => {
            if (err) console.log(err)
            else {
                if (result.rows.length === 0){
                    client.query("SELECT * FROM teacher WHERE username = $1", [
                        account.username
                    ], (err, result) => {
                        if (err) console.log(err)
                        else {
                            if (result.rows.length === 0){
                                socket.emit("error", "the username/password you gave was incorrect")
                                socket.disconnect()
                                disconnected = true
                            } else {
                                accounttype = "teacher"
                            }
                        }
                    })
                }
            }
        })

        if (!disconnected){
            socket_ids.set(username, socket.id)
        }
    } catch (error) {
        console.error(error)
    }

    console.log("successfully connected")

    socket.on("new-email", (e) => {
        let users = e.users
        let text = e.text
        let title = e.title

        let email_id

        (async function(){
            email_id = await (await client.query("INSERT INTO email (text, title) VALUES ($1, $2) RETURNING *;", [
                text,
                title
            ])).rows[0].id
        })()

        users.push(username)

        users.forEach(user => {
            (async function(){
                let user_id = await (await handlegetaccountid(accounttype, user))
                console.log([user_id, email_id])

                await (await client.query("INSERT INTO emails (user_id, email_id) VALUES ($1, $2);", [
                    user_id,
                    email_id
                ]))
            })()
            console.log(socket_ids.get(user))
            socket.to(socket_ids.get(user)).emit("email", {
                text,
                title,
                id: email_id
            })
        })
    })
})

const PORT = process.env.PORT || 3001

let client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

client.connect()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    console.log("hello")
    res.send("Welcome to my REST api.")
})

app.post("/api/v1/disconnected", async (req, res) => {
    try {   
        let account = verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET)

        socket_ids.delete(account.username)
    } catch (error) {
        console.error(error)
    }
})

app.get("/api/v1/emails/:accessToken/:limit", async (req, res) => {
    try {
        let email = new email_get(req, res, client)

        await email.run()
    } catch (error) {
        console.error(error)
    }
})

app.get("/api/v1/school/:username/:password", async (req, res) => {
    try {
        let school = new school_get(req, res, client)

        await school.run()
    } catch (error) {
        console.error(error)
    }
})

app.post("/api/v1/school/:username/:password/:school_name", async (req, res) => {
    try {
        let school = new school_post(req, res, client)

        await school.run()
    } catch (error) {
        console.error(error)
    }
})

app.get("/api/v1/teacher/:username/:password", async (req, res) => {
    try {
        let teacher = new teacher_get(req, res, client)
    
        teacher.run()
    } catch (error) {
        console.error(error)
    }
})

app.post("/api/v1/teacher/:username/:password/:email/:avatar", async (req, res) => {
    try {
        let teacher = new teacher_post(req, res, client)
        
        await teacher.run()
    } catch (error) {
        console.error(error)
    }
})

app.get("/api/v1/student/:username/:password", async (req, res) => {
    try {
        let student = new student_get(req, res, client)
    
        await student.run()
    } catch (error) {
        console.error(error)
    }
})

app.post("/api/v1/student/:username/:password/:email", async (req, res) => {
    try {
        let student = new student_post(req, res, client)
    
        await student.run()
    } catch (error) {
        console.error(error)
    }
})

app.post("/api/v1/lesson/:lessonname", async (req, res) => {
    try {
        let lesson = new lesson_post(req, res, client)
        
        await lesson.run()
    } catch (error) {
        console.error(error)
    }
})

app.get("/api/v1/lesson/:username/:password/:accounttype/:lessonname", async (req, res) => {
    try {
        let lesson = new lesson_get(req, res, client)

        await lesson.run()

    } catch (error) {
        console.error(error)
    }
})

app.get("/api/v1/lessons/:username/:password/:accounttype", async (req, res) => {
    try {
        let lessons = new lessons_get(req, res, client)

        await lessons.run()
    } catch (error) {
        console.error(error)
    }
})

app.put("/api/v1/lesson/:lesson_id/:lesson_change/:data_to_change/:username/:password", async (req, res) => {
    try {
        let lesson = new lesson_put(req, res, client)

        await lesson.run()
    } catch (error) {
        console.error(error)
    }
})

//http://localhost:3000/api/v1/lesson/2/description/a maths lesson/orson/1234
app.delete("/api/v1/lesson/:username/:password/:lesson_id", async (req, res) => {
    try {
        let lesson = new lesson_delete(req, res, client)

        await lesson.run()
    } catch (error) {
        console.error(error)
    }
})

app.post("/api/v1/timetable/:username/:password/:lesson_id", async (req, res) => {
    try {
        let timetable = new timetable_post(req, res, client)

        await timetable.run()
    } catch (error) {
        console.error(error)
    }
})

app.get("/api/v1/timetables/:username/:password", async (req, res) => {
    try {
        let timetables = new timetables_get(req, res, client)

        await timetables.run()
    } catch (error) {
        console.error(error)
    }
})

app.get("/query", async (req, res) => {

    try {

        let result = await (await client.query(req.body.query)).rows
        
        res.json({
            error: false,
            result: result
        })
    } catch (error) {
        console.error(error)

        res.json({
            error: true
        })
    }
})

console.log(PORT)

server.listen(PORT)