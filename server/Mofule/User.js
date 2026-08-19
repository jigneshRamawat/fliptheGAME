import mongoose from "mongoose";

const userSchem = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // password: {
    //   type: String,
    //   required: true,
    // },

    score: {
      type: Number,
      default: 0,
    },

    time: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("UserFlipGameRegister", userSchem);
export default User;
