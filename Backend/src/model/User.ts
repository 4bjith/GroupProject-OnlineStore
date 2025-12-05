import mongoose from "mongoose";
import bcrypt from "bcrypt";


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
        type: Date,
        default: Date.now
    },


})

// Use a normal function so "this" refers to the document
UserSchema.pre("save", async function ( ) {
    if (!this.isModified("password")) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;