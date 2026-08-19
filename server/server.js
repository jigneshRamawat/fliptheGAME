import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./Mofule/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://flipthe-game.vercel.app"],
  }),
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Email, username and password are required" });
  }

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    return res.status(400).json({
      message: "Email already registered",
    });
  }
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    return res.status(400).json({
      message: "Username already taken",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const createUser = await User.create({
    email,
    username,
    password: hashPassword,
    score: 0,
    time: 0,
  });

  return res.status(201).json({
    message: "Registration successful",
    user: {
      id: createUser.id,
      email: createUser.email,
      username: createUser.username,
    },
  });
});

// const data = [
//   {
//     email: "jignesh@gmail.com",
//     password: "123",
//     score: 0,
//     time: 0,
//   },
// ];

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const comparepassword = await bcrypt.compare(password, user.password);

    if (!comparepassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      message: "login success",

      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        score: user.score,
        time: user.time,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

app.put("/score/:id", async (req, res) => {
  try {
    const { score, time } = req.body;
    const {id} = req.params;

    // const user = await User.findOne({ email });

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    user.score = Math.max(user.score, score);

    if (user.time === 0) {
      user.time = time;
    } else {
      user.time = Math.min(user.time, time);
    }


    await user.save();

    res.status(200).json({
      message: "Score updated",
      user: {
        email: user.email,
        username: user.username,
        score: user.score,
        time: user.time,
      },
    });
  } catch (error) {
    console.log("Score error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// app.get("/data", (req, res) => {
//   res.status(200).json({
//     // email: data[0].email,
//     // score: data[0].score,
//     // time: data[0].time
//     data: data,
//   });
// });
// 
app.get("/data", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.log("Data error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`server runing on ${PORT}`);
});
