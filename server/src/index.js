import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './env'
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`MONGO DB connected on port: ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.log("MONGO DB connection failed", error);
});