class teacher {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db
        
        this.username = this.req.params.username
        this.password = this.req.params.password

        this.teacheraccount = []

        this.response = {
            success: false,
            error: true,
            accountexists: false,
            account: {}
        }       
    }
    
    main = async () => {
        try {
            await this.handlegetteacheraccount()
            
            if (this.teacheraccountexists()){
                this.response.accountexists = true
                this.response.success = true
                this.response.account = this.teacheraccount[0]
            } else {
                this.response.success = false
            }
    
            this.response.error = false
    
            this.res.json(
                this.response
            )
        } catch (error) {
            console.error(error)

            this.res.json({
                success: false,
                error: true,
                accountexists: false,
                account: {}
            })
        }
    }

    handlegetteacheraccount = async () => {
        this.teacheraccount = await (await this.db.query("SELECT * FROM teacher WHERE username = $1;", [
            this.username
        ])).rows
    }

    teacheraccountexists = () => {
        if (this.teacheraccount.length > 0){
            if (this.teacheraccount[0].password === this.password){
                return true
            }
        }

        return false
    }

    run = () => {
        this.main()
    }
}

module.exports = {teacher: teacher}