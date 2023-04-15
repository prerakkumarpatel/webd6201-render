"use strict";
// Import required modules
import mongoose from 'mongoose';
import {PassportLocalSchema} from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

// Define User schema
const UserSchema : any = new Schema(
    {
        DisplayName: String,
        EmailAddress: String,
        Username : String,
        Created : {
            type : Date,
            default : Date.now()
        },
        Updated: {
            type : Date,
            default: Date.now()
        }
    },
    {
        collection: "users" // Set the name of the collection in the database
    }
);

// Add passport-local-mongoose plugin to User schema
UserSchema.plugin(passportLocalMongoose);

// Create User model
const Model = mongoose.model("User", UserSchema);

// Define UserDocument type for use with the model
declare global {
    export type UserDocument = mongoose.Document & {
        username : String,
        EmailAddress : String,
        DisplayName : String
    }
}

export default Model; // Export the User model





