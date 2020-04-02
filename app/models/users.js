const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const boards = require("./boards");

const userSchema = new Schema({
    name: { type: String, required: true},
    username: { type: String, required: true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true},
    phone_num: { type: Number },
    theme: { type: Number, default: 0 },
    colabBoards: { type: Array },
    createdAt: { type: String, required: true},
    updatedAt: {type: String }
});

// Find all boards a user is a admin of and delet them from the database when a user is deleted.
userSchema.post("remove", user => {
    const userId = user._id;
    boards.find({_adminId: {$in:[userId]}}).then(userBoards =>{
        Promise.all(userBoards.map(board=> boards.findByIdAndDelete(board._id)));
    });
});


const User = mongoose.model("User", userSchema);
module.exports = User;