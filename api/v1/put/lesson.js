class lesson {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true
        }

        this.lesson_id = this.req.params.lesson_id
        this.lesson_change = this.req.params.lesson_change
        this.data_to_change = this.req.params.data_to_change
    }

    handleupdatedescription = async () => {
        try {
            console.log(this.data_to_change)
            await (await this.db.query("UPDATE lesson SET lessondescription = $1 WHERE id = $2;", [
                this.data_to_change,
                this.lesson_id
            ]))

            this.handlesendresult()
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handleupdatename = async () => {
        try {
            await (await this.db.query("UPDATE lesson SET name = $1 WHERE id = $2;", [
                this.data_to_change,
                this.lesson_id
            ]))

            this.handlesendresult()
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
        if (this.lesson_change === "description"){
            this.handleupdatedescription()
        } else if (this.lesson_change === "name"){
            this.handleupdatename()
        }
    }

    run = async () => {
        this.main()
    }
}

module.exports = {lesson: lesson}