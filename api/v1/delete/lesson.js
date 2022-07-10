class lesson {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true,
            lesson_deleted: true
        }

        this.username = req.params.username
        this.password = req.params.password
        this.lesson_id = req.params.lesson_id

        this.accountexists = true
    }

    handledeletelesson = async () => {
        try {
            await (await this.db.query("DELETE FROM lesson WHERE id = $1;", [
                this.lesson_id
            ]))
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
            this.response.lesson_deleted = false
        }
        await this.handledeletestudents()
        await this.handledeleteteachers()

        this.handlesendresult()
    }

    handledeletestudents = async () => {
        try {
            if (!this.response.error){
                await (await this.db.query("DELETE FROM students WHERE lesson_id = $1;", [
                    this.lesson_id
                ]))
            }

            this.response.students_deleted = true
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
            this.response.students_deleted = false
        }
    }

    handledeleteteachers = async () => {
        try {
            if (!this.response.error){
                await (await this.db.query("DELETE FROM teachers WHERE lesson_id = $1;", [
                    this.lesson_id
                ]))
            }

            this.response.teachers_deleted = true
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
            this.response.teachers_deleted = false
        }
    }

    handlecheckaccount = async () => {
        try {
            let account = await (await this.db.query("SELECT * FROM teacher WHERE username = $1;", [
                this.username
            ])).rows

            if (account.length > 0){
                if (account[0].password === this.password){
                    await this.handledeletelesson()
                }
            }
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
        await this.handlecheckaccount()
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {lesson: lesson}