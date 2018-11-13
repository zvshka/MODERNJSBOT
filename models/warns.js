const db = require('mongoose')

const warnSchema = db.Schema({

    UserID: String,
    ServerID: String,
    warns: Number,

})

module.exports = db.model("warns", warnSchema)