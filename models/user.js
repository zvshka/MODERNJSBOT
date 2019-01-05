const db = require('mongoose')

const userSchema = db.Schema({

    UserID: String,
    ServerID: String,
    Money: Number,
    Warns: Number,

})

module.exports = db.model("user", userSchema)