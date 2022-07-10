class lessons {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true,
            lessons: []
        }

        this.lessons = []

        this.username = req.params.username
        this.password = req.params.password

        this.accounttype = req.params.accounttype

        this.students = []
        this.teachers = []

        this.account = {}
        this.accountexists = true
    }

    handlegetstudent = async () => {
        try {
            let account = await (await this.db.query("SELECT * FROM student WHERE username = $1;", [
                this.username
            ])).rows[0]
    
            if (account.password === this.password){
                this.account = account
            } else {
                this.accountexists = false
            }

            await this.handlegetstudentids()
        } catch (error) {
            this.reponse.error = true
            this.reponse.success = false

            console.error(error)
        }
    }

    handlegetstudentids = async () => {
        try {
            if (this.accountexists && !this.response.error){
                let ids = await (await this.db.query("SELECT * FROM students WHERE student_id = $1;", [
                    this.account.id
                ])).rows

                for (let i = 0; i < ids.length; i++){
                    this.db.query("SELECT * FROM lesson WHERE id = $1;", [
                        ids[i].lesson_id
                    ], async (err, result) => {
                        try {
                            if (result.rows.length > 0){

                                let objecttopushtolessons = result.rows[0]

                                objecttopushtolessons.teachers = await (await this.handlegetteachers(result.rows[0].id))

                                this.lessons.push(objecttopushtolessons)
                            }
                            if (this.lessons.length === ids.length){
                                this.handlesendresult()
                            }
                        } catch (error) {
                            console.error(error)

                            this.response.error = true
                            this.response.success = false
                        }
                    })
                }
            }
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handlegetteachers = async (id) => {
        let ids = await (await this.db.query("SELECT * FROM teachers WHERE lesson_id = $1;", [
            id
        ])).rows

        let teachers = []

        for (let i = 0; i < ids.length; i++){
            let account = await (await this.db.query("SELECT * FROM teacher WHERE id = $1;", [
                ids[i].teacher_id
            ])).rows[0]

            teachers.push(account)
        }

        return teachers
    }

    handlegetstudents = async (id) => {
        let ids = await (await this.db.query("SELECT * FROM students WHERE lesson_id = $1;", [
            id
        ])).rows

        let students = []

        for (let i = 0; i < ids.length; i++){
            let account = await (await this.db.query("SELECT * FROM student WHERE id = $1;", [
                ids[i].student_id
            ])).rows[0]

            students.push(account)
        }

        return students
    }

    handlegetteacher = async () => {
        try {
            let account = await (await this.db.query("SELECT * FROM teacher WHERE username = $1;", [
                this.username
            ])).rows[0]
    
            if (account.password === this.password){
                this.account = account
            } else {
                this.accountexists = false
            }

            this.handlegetteacherids()
        } catch (error) {
            this.reponse.error = true
            this.reponse.success = false

            console.error(error)
        }
    }

    handlegetteacherids = async () => {
        try {
            if (this.accountexists && !this.response.error){
                let ids = await (await this.db.query("SELECT * FROM teachers WHERE teacher_id = $1;", [
                    this.account.id
                ])).rows

                for (let i = 0; i < ids.length; i++){
                    this.db.query("SELECT * FROM lesson WHERE id = $1;", [
                        ids[i].lesson_id
                    ], async (err, result) => {
                        try {
                            if (result.rows.length > 0){
                                let objecttopushtolessons = result.rows[0]

                                objecttopushtolessons.students = await (await this.handlegetstudents(result.rows[0].id))

                                this.lessons.push(objecttopushtolessons)
                            }
                            if (this.lessons.length === ids.length){
                                this.handlesendresult()
                            }
                        } catch (error) {
                            console.error(error)

                            this.response.error = true
                            this.response.success = false
                        }
                    })
                }
            }
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }
    }

    handlesendresult = () => {
        this.response.lessons = this.lessons

        this.res.json(
            this.response
        )
    }

    main = async () => {
        if (this.accounttype === "student"){
            await this.handlegetstudent()
        } else if (this.accounttype === "teacher") {
            await this.handlegetteacher()
        }
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {lessons: lessons}