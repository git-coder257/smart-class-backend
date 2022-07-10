// import { io, Socket } from "socket.io-client"
let { io } = require("socket.io-client")
let { verify } = require("jsonwebtoken")
require("dotenv").config()

class email {
    // private accessToken: string | null
    // private socket: Socket | undefined
    // private connected: boolean

    constructor (accessToken){
        this.accessToken = accessToken

        this.connected = false
    }

    handleStartWebSocketConnection = () => {
        // console.log(this.accessToken)
        this.socket = io("http://localhost:3001", {
            reconnectionDelayMax: 10000,
            auth: {
                key: this.accessToken
            }
        })

        this.socket.on("connect", () => {
            console.log("hi")
        })
    }

    handleSendEmail = (emailText) => {
        if (this.socket !== undefined){
            console.log("hello world")
            // console.log(this.socket)
            this.socket.emit("new-email", {
                emailText: emailText
            })
        }
    }
}

// console.log(verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9yc29uIiwicGFzc3dvcmQiOiIxMjM0IiwiaWF0IjoxNjU3MzQ4NDQxfQ.jp4jm1MgRae6kmhJ2Z31c0sVKru8WSaYjat2gi5gSSk", process.env.ACCESS_TOKEN_SECRET))

let emailInstance1 = new email("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9yc29uIiwicGFzc3dvcmQiOiIxMjM0IiwiaWF0IjoxNjU3MzQ4NDQxfQ.jp4jm1MgRae6kmhJ2Z31c0sVKru8WSaYjat2gi5gSSk")

emailInstance1.handleStartWebSocketConnection()

emailInstance1.handleSendEmail("hello")

// export { email }