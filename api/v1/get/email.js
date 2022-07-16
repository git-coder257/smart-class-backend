const { compare } = require("bcrypt");
const { verify } = require("jsonwebtoken")
require('dotenv').config();

class email {
    constructor(req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.accessToken = this.req.params.accessToken
        
        let account = verify(this.accessToken, process.env.ACCESS_TOKEN_SECRET)

        console.log(account)

        this.username = account.username
        this.password = account.password

        this.limit = this.req.params.limit 

        this.response = {
            success: true,
            error: false,
            emails: []
        }
    }

    handlegetaccountid = async () => {
        try {
            let account = await (await this.db.query("SELECT id, password FROM student WHERE username = $1;", [
                this.username
            ])).rows
            console.log(account)
            if (account.length > 0){
                if (compare(account[0].password, this.password)){
                    this.user_id = account[0].id
                    this.handlegetemail_ids()
                }
            }
        } catch (error) {
            this.response.success = false
            this.response.error = true

            console.error(error)
        }
    }

    handlegetemail_ids = async () => {
        console.log("hello world")
        try {
            let email_ids = await (await this.db.query("SELECT * FROM emails WHERE user_id = $1 fetch first $2 rows only;", [
                this.user_id,
                this.limit
            ])).rows
            console.log(email_ids)
            for (let { email_id } of email_ids){
                console.log(email_id)
                this.handlegetemail(email_id)
            }
        } catch (error) {
            this.response.success = false
            this.response.error = true

            console.error(error)
        }
    }

    handlegetemail = async (email_id) => {
        try {
            let email = await (await this.db.query("SELECT * FROM email WHERE id = $1;", [
                email_id
            ])).rows[0]

            console.log(email)

            this.response.emails.push(email)

            await this.handlesendresult()
        } catch (error) {
            this.response.success = false
            this.response.error = true

            console.error(error)
        }
    }

    main = async () => {
        await this.handlegetaccountid()
    }

    run = async () => {
        await this.main()
    }

    handlesendresult = async () => {
        this.res.send(
            this.response
        )
    }
}

module.exports = {email: email}