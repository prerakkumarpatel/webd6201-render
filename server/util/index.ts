// Import necessary packages and modules
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as DBconfig from "../config/db";

// Function to get the display name of the user associated with the request
export function UserDisplayName(req: Request): string {
    if (req.user) {
        let user = req.user as UserDocument;
        // Log that the function has been called
        console.log('user display name called');
        return user.DisplayName.toString();
    }
    return '';
}

// Middleware to check if the user is authenticated or not
export function AuthGuard(req: Request, res: Response, next: NextFunction): void {
    if (!req.isAuthenticated()) {
        console.log("Auth guard called of express");
        return res.redirect('/login')
    }
    next();
}

// Function to generate a JWT token for a user
export function GenerateToken(user: any): string {
    // Define the payload for the token
    const payload = {
        id: user.id,
        DisplayName: user.displayName,
        EmailAddress: user.EmailAddress,
        username: user.username
    };

    // Define options for the JWT token
    const jwrOptions = {
        expiresIn: 604800
    };

    // Sign the payload using the session secret from the DB config
    return jwt.sign(payload, DBconfig.SessionSecret, jwrOptions);
}
