require('dotenv').config();
const { Client } = require("pg")

(async () => {
    let client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    })
    
    await client.connect()

    client.query("CREATE TABLE email (id SERIAL PRIMARY KEY, text TEXT, title TEXT);")
    client.query("CREATE TABLE emails (user_id INT, email_id INT PRIMARY KEY);")
})()