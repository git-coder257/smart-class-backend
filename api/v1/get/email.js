class email {
    constructor(req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            success: true,
            error: false,
            emails: []
        }
    }

    handlegetemails = () => {
        try {
            let emails = this.db.query("SELECT * FROM email WHERE ")
        } catch (error) {
            this.response.success = false
            this.response.error = true

            console.error(error)
        }
    }

    main = () => {
        this.handlegetemails()
    }

    run = () => {
        this.main()
    }

    handlesendresult = () => {

    }
}