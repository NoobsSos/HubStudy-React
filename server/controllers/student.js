import Student from "../models/Student.js";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

export const createNewUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            city,
            email,
            password
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new Student({
            firstName,
            lastName,
            city,
            email,
            password: passwordHash
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(501).json({error: err.message});
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Student.findOne({email: email });
        if (!user) return res.status(400).json({msg: "User does not exist"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({msg: "Invadil credentials"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getAllStudents = async (req, res) => {
    try {
        const student = await Student.find();
        res.status(200).json(student);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
  }
