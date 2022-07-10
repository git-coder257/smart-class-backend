class timetables {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true,
            lesson: []
        }

        this.username = this.req.params.username
        this.password = this.req.params.password

        this.account = {}

        this.lesson_ids = []
        this.timetables = []
    }

    handlegetlessonids = async () => {
        try {
            let ids = await (await this.db.query("SELECT * FROM teachers WHERE teacher_id = $1;", [
                this.account.id
            ])).rows

            this.lesson_ids = ids

            await this.handlegettimetable()
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handlegetlesson = () => {

    }
    
    handlegettimetable = async () => {
        try {

            for (let i = 0; i < this.lesson_ids.length; i++){
                await this.db.query("SELECT * FROM timetable WHERE lesson_id = $1;", [
                    this.lesson_ids[i].lesson_id
                ], async (err, result) => {
                    console.log("hi")
                    try {
                        if (result.rows.length > 0){

                            let objecttopushtotimetables = result.rows[0]

                            await (await this.db.query("SELECT * FROM time WHERE timetable_id = $1;", [
                                result.rows[0].id
                            ], async (err, result) => {

                                console.log(objecttopushtotimetables)
                            
                                this.timetables.push(objecttopushtotimetables)

                                if (this.lesson_ids.length - 1 === i){
                                    console.log("hello")
                                }
                            }))

                        }
                        if (this.lesson_ids.length - 1 === i && result.rows.length === 0){
                            console.log("hello")
                        }
                    } catch (error) {
                        console.error(error)

                        this.response.error = true
                        this.response.success = false
                    }
                })
            }
        } catch (error) {
            console.error(error)
            
            this.response.error = true
            this.response.success = false
        }
    }

    handlegetaccount = async () => {
        try {
            let account = await (await this.db.query("SELECT * FROM teacher WHERE username = $1;", [
                this.username
            ])).rows

            if (account.length > 0){
                if (account[0].password === this.password){
                    this.account = account[0]
                    await this.handlegetlessonids()
                }
            }
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handlesendresult = () => {
        console.log(this.timetables)
        this.res.json(
            this.response
        )
    }

    main = async () => {
        try {
            await this.handlegetaccount()
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    run = async () => {
        this.main()
    }
}

module.exports = {timetables: timetables}