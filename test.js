// import { io, Socket } from "socket.io-client"
let { io } = require("socket.io-client")
let { verify } = require("jsonwebtoken")
require("dotenv").config()
let { get } = require("axios").default

class email {
    // private accessToken: string | null
    // private socket: Socket | undefined
    // private connected: boolean

    constructor (accessToken, username){
        this.accessToken = accessToken
        this.username = username

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
            this.socket.emit(this.username, this.username)
        })
    }

    handleSendEmail = (emailText, users) => {
        if (this.socket !== undefined){
            console.log("hello world")
            this.socket.emit("new-email", {
                text: emailText,
                users: users
            })
        }
    }
}

let accounts = [{username: "orson", password: "1234"}, {username: "orson2", password: "1234"}]

const getaccount = async (username, password) => {
    let response = await(await get(`http://localhost:3001/api/v1/student/${username}/${password}`).catch((e) => {
        console.error(e)
    })).data

    return response.accessToken
}

let accessTokens = []

const main = async () => {
    for (let account of accounts){
        // console.log(await getaccount(account.username, account.password))
        let accessToken = await getaccount(account.username, account.password)
        accessTokens.push(accessToken)
    }

    // for (let accessToken of accessTokens){
        // }
        
    let emailInstance = new email(accessTokens[0])
    
    emailInstance.handleStartWebSocketConnection()
    
    emailInstance.handleSendEmail("hello", [
        "orson2"
    ])
    
}

main()

// console.log(verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9yc29uIiwicGFzc3dvcmQiOiIxMjM0IiwiaWF0IjoxNjU3MzQ4NDQxfQ.jp4jm1MgRae6kmhJ2Z31c0sVKru8WSaYjat2gi5gSSk", process.env.ACCESS_TOKEN_SECRET))

// let emailInstance1 = new email("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9yc29uIiwicGFzc3dvcmQiOiIxMjM0IiwiaWF0IjoxNjU3MzQ4NDQxfQ.jp4jm1MgRae6kmhJ2Z31c0sVKru8WSaYjat2gi5gSSk")

// emailInstance1.handleStartWebSocketConnection()

// emailInstance1.handleSendEmail("hello")

// export { email }