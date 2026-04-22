const moongose = require("mongoose")
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

// conexão
const conn = async () => {
    try {
        const dbConn = await moongose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.uynzzqg.mongodb.net/?appName=Cluster0`
        )

        console.log("Conectou ao Banco")

        return dbConn
    } catch (error) {
        console.log(error)
    }
}

conn()

module.exports = conn