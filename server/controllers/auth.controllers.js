import User from "../models/user.models.js";
import bycrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utlis/generateToken.js";
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordMatch = await bycrypt.compare(
      password,
      user.password || ""
    );

    if (!user || !isPasswordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const logout = async(req, res) => {
  try {
    
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"User logged out successfully"});
  } catch (error) {
    console.log("error in logout", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmpassword, gender } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Password do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    //Hash password

    const salt = await bycrypt.genSalt(10); //this will generate a salt the higher the number the more secure the password but it will take more time

    const hashPassword = await bycrypt.hash(password, salt); //this will generate a hash password

    //Hashing of password is done to secure the password

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      //generat jwt token
      generateTokenAndSetCookie(newUser._id, res); //this will generate a token and set it in the cookie
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "invaild user data" });
    }
  } catch (error) {
    console.log("error in signup", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
