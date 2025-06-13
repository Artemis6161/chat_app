const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};


const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return token + user info
    const token = generateToken(newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => { 
    const {email,password} = req.body;
    try{
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user)return res.status (400).json({message:"Invalid username"});
const ismatch = await bcrypt.compare(password, user.password);
if (!ismatch) return res.status(400).json({message:"Invalid password"});
// generate token
const token =generateToken(user._id);
res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
})

        

    }catch(err){
        console.error("Error logging in user:", err);
        return res.status(500).json({ message: "Server error" });

    }
}
module.exports = {
  registerUser,
  login,
};