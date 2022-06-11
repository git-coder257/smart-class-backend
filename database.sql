CREATE TABLE student (id SERIAL PRIMARY KEY , username VARCHAR(40) UNIQUE, password VARCHAR(40) , email VARCHAR(40), avatar TEXT);
CREATE TABLE students (student_id INT, lesson_id INT);
ALTER TABLE table_name ALTER COLUMN column_name datatype;
CREATE TABLE lesson (name VARCHAR(50), lessondescription TEXT, id SERIAL PRIMARY KEY);
CREATE TABLE teacher (id SERIAL PRIMARY KEY, username VARCHAR(40) UNIQUE , password VARCHAR(40) , email VARCHAR(40) , avatar TEXT );
CREATE TABLE teachers (teacher_id INT , id SERIAL PRIMARY KEY);
CREATE TABLE timetable (id SERIAL  PRIMARY KEY, teachers_id INT , students_id INT );
CREATE TABLE homework (id SERIAL  PRIMARY KEY, teachers_id INT , students_id INT , description TEXT );