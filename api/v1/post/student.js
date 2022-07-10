let { hash } = require("bcrypt")

class student {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db
        
        this.username = this.req.params.username
        this.password = this.req.params.password
        this.email = this.req.params.email
        this.avatar = this.req.body.avatar

        this.studentaccount = []

        this.response = {}       
    }

    handlecreatestudentaccout = async () => {
        try {
            let hashedPassword = await hash(this.password, 10)

            this.studentaccount = await (await this.db.query("INSERT INTO student (username, password, email, avatar) VALUES ($1, $2, $3, $4) RETURNING *;", [
                this.username,
                hashedPassword,
                this.email,
                this.avatar
            ])).rows

            console.log(hashedPassword)

            if (this.studentaccount.length === 0){
                this.response.success = false
            } else {
                this.response.account = this.studentaccount[0]
                this.response.success = true
            }
        } catch (error) {
            this.response.error = true
            this.response.success = false
            this.response.account = {}

            console.error(error)
        }
    }
    
    main = async () => {
        try {
            await this.handlecreatestudentaccout()

            if (this.response.error === undefined){
                this.response.error = false
            }

            this.res.json(
                this.response
            )
        } catch (error) {
            console.error(error)
        }
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {student: student}