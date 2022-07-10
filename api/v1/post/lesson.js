class lesson {
    constructor (req, res, db){
        this.req = req
        this.res = res
        this.db = db

        this.students = this.req.body.students
        this.teachers = this.req.body.teachers

        this.lessonname = this.req.params.lessonname
        this.description = this.req.body.description

        this.lesson = {}

        this.response = {
            error: false,
            success: true,
        }
    }

    handlecreateteachers = async () => {
        try {
            for (let i = 0; i < this.teachers.length; i++){
                try {
                    let teacher_id = await (await this.db.query("SELECT * FROM teacher WHERE username = $1;", [
                        this.teachers[i]
                    ])).rows[0].id
                    
                    this.db.query("INSERT INTO teachers (lesson_id, teacher_id) VALUES ($1, $2);", [
                        this.lesson.id,
                        teacher_id
                    ])

                    console.log(teacher_id)
                } catch (error) {
                    console.error(error)

                    this.response.error = true
                    this.response.success = false

                    break
                }
            }
        } catch (error) {
            this.response.error = true
            this.response.success = false

            console.error(error)
        }
    }

    handlecreatestudents = async () => {
        try {
            for (let i = 0; i < this.students.length; i++){
                try {
                    let student_id = await (await this.db.query("SELECT * FROM student WHERE username = $1;", [
                        this.students[i]
                    ])).rows[0].id
                                    
                    this.db.query("INSERT INTO students (lesson_id, student_id) VALUES ($1, $2);", [
                        this.lesson.id,
                        student_id
                    ])
                } catch (error) {
                    console.error(error)

                    this.response.error = true
                    this.response.success = false

                    break
                }
            }
        } catch (error) {
            this.response.error = true
            this.response.success = false

            console.error(error)
        }
    }

    handlecreatelesson = async () => {
        try {
            this.lesson = await (await this.db.query("INSERT INTO lesson (lessondescription, name) VALUES ($1, $2) RETURNING *;", [
                this.description,
                this.lessonname
            ])).rows[0]
        } catch (error) {
            this.response.error = true
            this.response.success = false

            console.error(error)
        }
    }

    main = async () => {
        try {

            await this.handlecreatelesson()

            await this.handlecreatestudents()
            await this.handlecreateteachers()

            if (!this.response.error){
                this.response.lesson = this.lesson
            } else {
                this.response.lesson = {}
            }

            this.res.json(
                this.response
            )

        } catch (error) {
            console.error(error)
        }
    }

    run = async () => {
        await this.main()
    }
}

module.exports = {lesson: lesson}