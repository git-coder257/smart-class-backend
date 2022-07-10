class lesson {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.response = {
            error: false,
            success: true,
            lesson: {}
        }

        this.lesson = {}

        this.username = req.params.username
        this.password = req.params.password

        this.accounttype = req.params.accounttype
        this.lessonname = req.params.lessonname

        this.students = []
        this.studentids = []
        this.teachers = []
        this.teacherids = []

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

                await this.handlegetstudentids()
            } else {
                this.accountexists = false
            }
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
                    this.db.query("SELECT * FROM lesson WHERE id = $1 AND name = $2;", [
                        ids[i].lesson_id,
                        this.lessonname
                    ], async (err, result) => {
                        try {
                            if (result.rows.length > 0){

                                console.log(result.rows[0])

                                this.response.lesson = result.rows[0]
                                this.lesson = result.rows[0]
                                
                                this.handlegetstudentsids()
                                this.handlegetteachersids()
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

    handlegetstudentsids = async () => {
        try {
            let ids = await (await this.db.query("SELECT * FROM students WHERE lesson_id = $1;", [
                this.lesson.id
            ])).rows

            console.log(ids)

            this.studentids = ids
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }

        this.handlegetstudents()
    }

    handlegetstudents = async () => {
        for (let i = 0; i < this.studentids.length; i++){
            console.log(this.studentids[i].student_id)

            this.db.query("SELECT * FROM student WHERE id = $1;", [
                this.studentids[i].student_id
            ], async (err, result) => {
                try {
                    console.log(result.rows)
                    if (result.rows.length > 0){

                        this.students.push(result.rows[0])
                    }
                    if (i === this.studentids.length - 1){
                        this.response.students = this.students
                        if (this.response.teachers !== undefined){
                            this.handlesendresult()
                        }
                    }
                } catch (error) {
                    console.error(error)

                    this.response.error = true
                    this.response.success = false
                }
            })
        }
    }

    handlegetteachersids = async () => {
        try {
            let ids = await (await this.db.query("SELECT * FROM teachers WHERE lesson_id = $1;", [
                this.lesson.id
            ])).rows

            console.log(ids, "here")

            this.teacherids = ids
        } catch (error) {
            console.error(error)

            this.response.error = true
            this.response.success = false
        }

        this.handlegetteachers()
    }

    handlegetteachers = async () => {
        for (let i = 0; i < this.teacherids.length; i++){
            console.log(this.teacherids[i].teacher_id)

            this.db.query("SELECT * FROM teacher WHERE id = $1;", [
                this.teacherids[i].teacher_id
            ], async (err, result) => {
                try {
                    console.log(result.rows)

                    if (result.rows.length > 0){

                        this.teachers.push(result.rows[0])
                    }
                    if (i === this.teacherids.length - 1){
                        this.response.teachers = this.teachers
                        if (this.response.students !== undefined){
                            this.handlesendresult()
                        }
                    }
                } catch (error) {
                    console.error(error)

                    this.response.error = true
                    this.response.success = false
                }
            })
        }
    }

    handlegetteacher = async () => {
        try {
            let account = await (await this.db.query("SELECT * FROM teacher WHERE username = $1;", [
                this.username
            ])).rows[0]
    
            if (account.password === this.password){
                this.account = account
                this.handlegetteacherids()
            } else {
                this.accountexists = false
            }
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
                    this.db.query("SELECT * FROM lesson WHERE id = $1 AND name = $2;", [
                        ids[i].lesson_id,
                        this.lessonname
                    ], (err, result) => {
                        try {
                            if (result.rows.length > 0){

                                console.log(result.rows[0])

                                this.response.lesson = result.rows[0]
                                this.lesson = result.rows[0]

                                this.handlegetstudentsids()
                                this.handlegetteachersids()
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
        this.res.json(
            this.response
        )
    }

    main = async () => {
        if (this.accounttype === "student"){
            await this.handlegetstudent()
        } else if (this.accounttype === "teacher"){
            await this.handlegetteacher()
        }
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {lesson: lesson}