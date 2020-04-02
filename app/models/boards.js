const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    _adminId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    icebox: {type: Array},
    started: {type: Array},
    done: {type: Array},
    collaborators: {type: Array},
    createdAt: { type: String, required: true},
    updatedAt: {type: String }
})

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;