class timetable {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true
        }

        this.username = this.req.params.username
        this.password = this.req.params.password
        this.lesson_id = this.req.params.lesson_id

        this.times = this.req.body.times
    }

    handlecheckaccount = async () => {
        try {
            let account = await (await this.db.query("SELECT * FROM teacher WHERE username = $1;", [
                this.username
            ])).rows

            if (account.length > 0){
                if (account[0].password === this.password){
                    await this.handlecreatetimetable()
                }
            }
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handlecreatetimetable = async () => {
        try {
            this.timetable = await (await this.db.query("INSERT INTO timetable (lesson_id) VALUES ($1) RETURNING *;", [
                this.lesson_id
            ])).rows[0]

            await this.handlecreatetime()
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handlecreatetime = async () => {
        try {
            for (let i = 0; i < this.times.length; i++){
                this.db.query("INSERT INTO time (time, timetable_id) VALUES ($1, $2);", [
                    this.times[i],
                    this.timetable.id
                ])
            }

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
        await this.handlecheckaccount()
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {timetable: timetable}