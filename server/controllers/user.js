import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'

export const signin = async (req,res) => {
    const { email , password } = req.body;
    try {
        //attempting to find existing user 
        const existingUser = await User.findOne({ email });
        //if user doesn't exist send 404
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist. "});

        const isPasswordCorrect = await bcrypt.compare( password, existingUser.password );
        //if password is incorrect , send 400
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid password. "});
        //sign jwt and provide secrets
        const token = jwt.sign({email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h"});
        res.status(200).json( { result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong...'});
    }
}

export const signup = async (req,res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        //if user already exist 400
        if(existingUser) return res.status(400).json({ message: "User already exist. "});

        if(password !== confirmPassword) return res.status(400).json({message: "passwords don't match"});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`});
        const token = jwt.sign({email: result.email, id: result._id }, 'test', { expiresIn: "1h"});
        res.status(200).json( { result, token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong...'});
    }
}