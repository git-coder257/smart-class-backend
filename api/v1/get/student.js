let { sign } = require("jsonwebtoken")
let { compare } = require("bcrypt")
require("dotenv").config()

class student {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db
        
        this.username = this.req.params.username
        this.password = this.req.params.password

        this.studentaccount = []

        this.response = {
            success: false,
            error: true,
            accountexists: false,
            accessToken: "",
            account: {}
        }      
    }
    
    main = async () => {
        try {
            await this.handlegetstudentaccount()
            
            if (await (await this.studentaccountexists())){
                this.response.accountexists = true
                this.response.success = true
                this.response.account = this.studentaccount[0]

                delete this.response.account["password"]
            } else {
                this.response.accountexists = false
                this.response.success = false
            }
    
            this.response.error = false
    
            this.res.json(
                this.response
            )
        } catch (error) {
            console.error(error)

            this.res.json(
                this.response
            )
        }
    }

    

    handlegetstudentaccount = async () => {
        this.studentaccount = await (await this.db.query("SELECT * FROM student WHERE username = $1;", [
            this.username
        ])).rows
    }

    studentaccountexists = async () => {
        if (this.studentaccount.length > 0){
            // if (this.studentaccount[0] === this.password){
            console.log(await (await compare(this.password, this.studentaccount[0].password)))
            if (await (await compare(this.password, this.studentaccount[0].password))){
                try {
                    let account = {
                        username: this.username,
                        password: this.password
                    }
                    let accessToken = sign(account, process.env.ACCESS_TOKEN_SECRET)
                    console.log(accessToken)
                    this.response.accessToken = accessToken
                    this.response.success = false
                    return true
                } catch (error) {
                    console.error(error)

                    this.response.success = false
                    this.response.error = true
                }
            } else {
                this.response.accountexists = false
                this.response.success = false
            }
        }

        return false
    }

    run = async () => {
        this.main()
    }
}

module.exports = {student: student}