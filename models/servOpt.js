const db = require('mongoose')

const optSchema = db.Schema({

    ServerID: String,
    Prefix: String,
    AutoRole: String,

})

module.exports = db.model("options", optSchema)