class school {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true,
            accountexists: true,
            account: {}
        }

        this.username = this.req.params.username
        this.password = this.req.params.password
    }

    handlegetaccount = async () => {
        try {
            let account = await (await this.db.query("SELECT * FROM school WHERE username = $1;", [
                this.username
            ])).rows

            if (account.length > 0){
                if (account[0].password === this.password){

                } else {
                    this.response.success = false
                    this.response.accountexists = false
                }
            } else {
                this.response.success = false
                this.response.accountexists = false
            }

        } catch (error) {
            this.response.error = true
            this.response.success = false
            this.response.accountexists = false
        }
    }

    main = async () => {
        await this.handlegetaccount()
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {school: school}