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


// verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9yc29uIiwicGFzc3dvcmQiOiIxMjM0IiwiaWF0IjoxNjU2NzU2NTQzfQ.2jrZyPSpbA51eyXrGJbJ1sO8YBTaPQ-CblROZs8RQrc", process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(user)
// })

// const start = () => {

// console.log(io.)


io.on("connection", socket => {
    let username

    console.log(socket.handshake.auth.key)
    try {
        let account = verify(socket.handshake.auth.key, process.env.ACCESS_TOKEN_SECRET)
        console.log(account)
        username = account.username
    } catch (error) {
        console.error(error)
    }
    
    console.log("successfully connected")
    
    socket.on("new-email", (e) => {
        let users = e.users
        let text = e.text
        
        users.forEach(user => {
            let compressInstance = new compress()
            compressInstance.handlecompress("")
            socket.emit(user, {
                text
            })
        })
    })
})
// }

// let socketvar

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
    // console.log("hello")
    res.send("Welcome to my REST api.")
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

//http://localhost:3000/api/v1/lessons/orson/1234/student
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

// app.listen(PORT, () => {
//   console.log("running on port: " + PORT)
// })

console.log(PORT)

server.listen(PORT)

// class compress {
//     constructor (hello){
//         this.text = ""

//         this.separate_with = '~';
//         this.encodable = this.get_map('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.');
//         this.base10 = this.get_map('0123456789')

//         this.algorithm = compressjs.Lzp3
//     }

//     handlecompress = (text) => {
//         let data = new Buffer.from(text, "utf8")

//         let compressedData = this.algorithm.compressFile(data)

//         return this.encodeNums(compressedData)
//     }

//     handledecompress = (decompressedDataParams) => {
//         let decompressedData = this.decodeNums(decompressedDataParams)

//         var decompressed = this.algorithm.decompressFile(decompressedData);

//         var data = new Buffer.from(decompressed).toString('utf8');

//         return data
//     }

//     get_map(s) {
//         let d = {}
//         for (var i=0; i<s.length; i++) {
//             d[s.charAt(i)] = i}
//         d.length = s.length
//         d._s = s
//         return d
//     }
    
//     baseconvert(number, fromdigits, todigits) {
//         var number = String(number)
        
//         let neg

//         if (number.charAt(0) == '-') {
//             number = number.slice(1, number.length)
//             neg=1}
//         else {
//             neg=0}
    
//         var x = 0
//         for (var i=0; i<number.length; i++) {
//             var digit = number.charAt(i)
//             x = x*fromdigits.length + fromdigits[digit]
//         }
    
//         let res = ""
//         while (x>0) {
//             let remainder = x % todigits.length
//             res = todigits._s.charAt(remainder) + res
//             x = parseInt(x/todigits.length)
//         }
    
//         if (neg) res = "-"+res
//         return res
//     }
    
//     encodeNums(L) {
//         var r = []
//         for (var i=0; i<L.length; i++) {
//              r.push(this.baseconvert(L[i], this.base10, this.encodable))
//         }
//         return r.join(this.separate_with)
//     }
    
//     decodeNums(s) {
//         var r = []
//         var s = s.split(this.separate_with)
//         for (var i=0; i<s.length; i++) {
//              r.push(parseInt(this.baseconvert(s[i], this.encodable, this.base10)))
//         }
//         return r
//     }
// }