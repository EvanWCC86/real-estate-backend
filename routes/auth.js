const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validateRegisterInput, validateLoginInput} = require("../util/validators")
require("dotenv").config();

function generateToken(user) {
    return jwt.sign(
        {
            id:user._id,
            email:user.email,
            username:user.username
        },
        process.env.SECRET_KE,
        {expiresIn: "1h"}
    )
}

// Register
router.post("/register", async (req,res) => {
    const {username,email,password,confirmPassword} = req.body;
    // validate user data
    const {valid, errors } = validateRegisterInput(username,email,password,confirmPassword);
    if(!valid) {
        res.json(errors)
    }
    try {
        // make sure user doesnt already exist
        const exitusername = await User.findOne({username})
        if(exitusername) {
            res.json({error: "username is taken"})
        }
        const exitemail = await User.findOne({email})
        if(exitemail) {
            return res.status(422).json({
                error: "This user already exit"
            })
        }
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        // create new user
        const newUser = new User ({
            username,
            email,
            password: hashedPassword,
            createdAt:new Date().toISOString()
        });
        // save user and respond
        const user = newUser.save();
        const token = generateToken(user)
        res.json({
            userId:user._id,
            username:user.username,
            token:token
        })
    } catch (error) {
        res.status(500).json(error)
    }

})

// Login
router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const {errors, valid} = validateLoginInput(username, password);
    if(!valid) {
        res.json(errors)
    }
    
    try {
        const user = await User.findOne({username});
        !user && res.status(200).json({error: "user not found"})

        const validPassword = await bcrypt.compare(password, user.password)
        !validPassword && res.status(400).json({error: "wrong password"})
        const token = generateToken(user);
        res.json({
            userId:user._id,
            username:user.username,
            token:token
        })
    } catch (error) {
        res.status(500).json(error)
    }
})




module.exports = router;