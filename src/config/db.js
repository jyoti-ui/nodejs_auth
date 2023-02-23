require("dotenv").config();
const mongoose = require("mongoose");
const {MONGO_URL} = process.env;

const connectToDB = async() => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })
        console.log("DB connected")
    }catch(error) {
        console.log(error)
    }
}

connectToDB();