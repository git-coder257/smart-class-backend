class school {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true,
            account: {}
        }

        this.username = this.req.params.username
        this.password = this.req.params.password
        this.school_name = this.req.params.school_name
    }

    handlecreateaccount = async () => {
        try {
            
            let account = await (await this.db.query("INSERT INTO school (username, password, school_name) VALUES ($1, $2, $3) RETURNING *;", [
                this.username,
                this.password,
                this.school_name
            ]))

            this.response.account = account
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handlesendresult = () => {
        this.res.json(
            this.response
        )
    }

    main = async () => {
        await this.handlecreateaccount()
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {school: school}