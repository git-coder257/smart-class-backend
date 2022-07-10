class teacher {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db
        
        this.username = this.req.params.username
        this.password = this.req.params.password
        this.email = this.req.params.email
        this.avatar = this.req.params.avatar

        this.teacheraccount = []

        this.response = {}       
    }

    handlecreateteacheraccout = async () => {
        try {
            this.teacheraccount = await (await this.db.query("INSERT INTO teacher (username, password, email, avatar) VALUES ($1, $2, $3, $4) RETURNING *;", [
                this.username,
                this.password,
                this.email,
                this.avatar
            ])).rows

            console.log()

            if (this.teacheraccount.length === 0){
                this.response.success = false
            } else {
                this.response.account = this.teacheraccount[0]
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
            await this.handlecreateteacheraccout()

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

module.exports = {teacher: teacher}