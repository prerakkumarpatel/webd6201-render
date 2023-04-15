//import mongoose
import  mongoose from "mongoose";

//creating schema
const  ContactSchema : any = new mongoose.Schema(
    {
        FullName:String,
        ContactNumber:String,
        EmailAddress:String
    },
    {
    collection:"contacts"}
);

// creating model
const Model = mongoose.model("Contact",ContactSchema);
export default Model;