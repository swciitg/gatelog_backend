import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import roles from "../admin_panel/roles.js";

const roleValues = [];
for (const k in roles) roleValues.push(roles[k]);

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [
            {
                type: String,
                enum: roleValues
            }
        ]
    }
});

adminSchema.pre("save", async function (next) {
    console.log("HASHING PASSWORD");
    if (!this.isModified("password")) {
        return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    console.log(hashed);
    this.password = hashed;
    return next();
});

adminSchema.pre("findOneAndUpdate", async function (next) {
    console.log("HASHING UPDATED PASSWORD");
    const update = this.getUpdate();
    console.log(update);
    let thisAdmin = await KhokhaAdmin.findById(update.$set._id);
    if (thisAdmin.password !== update.$set.password) {
        // password changed from admin panel
        const hashed = await bcrypt.hash(update.$set.password, 10);
        console.log(hashed);
        update.$set.password = hashed;
        return next();
    }
    return next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log(candidatePassword, this.password);
        console.log(await bcrypt.hash(candidatePassword, 10));
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

const KhokhaAdmin = mongoose.model("KhokhaAdmin", adminSchema);

export default KhokhaAdmin;