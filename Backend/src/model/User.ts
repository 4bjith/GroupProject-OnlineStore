import mongoose from "mongoose";
// import bcrypt from "bcrypt,js";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    createdAt: {
        type: String,
        default: ""
    },


})

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;