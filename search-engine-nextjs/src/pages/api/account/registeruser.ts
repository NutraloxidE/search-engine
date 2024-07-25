//src\pages\api\account\registeruser.ts
import connectDB from "@/utils/db";
import user from "@/utils/models/DataUser";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req:NextApiRequest, res:NextApiResponse) => {
  if (req.method === 'POST') {
    // POSTリクエストの場合、リクエストボディからユーザーデータを取得
    const userData = req.body;

    // ここでデータベースにユーザーデータを保存します
    try {
      await connectDB();
      
      const userGoingToBeCreated = new user(userData);
      console.log(userGoingToBeCreated);
      
      const isValid = await ValidateUserData(userGoingToBeCreated);
      if (!isValid) {
        res.status(420).json({ error: 'Invalid data' });
        return;
      }

      //save it to mongodb
      await userGoingToBeCreated.hashPassword();
      await userGoingToBeCreated.save();
      console.log("User created successfully");

    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // レスポンスを送信
    res.status(200).json({ status: 'Created', userData });
  } else {
    // POST以外のリクエストメソッドは許可しない
    res.status(405).json({ error: 'Method not allowed, stop trying to hack us :(' });
  }
};

async function ValidateUserData(userGoingToBeCreated: any) {

  // Check if the email is valid
  const existingUser = await user.findOne({ email: userGoingToBeCreated.email });
  console.log("data imma check:\n"+userGoingToBeCreated.email);
  console.log("user i got from DB:\n"+existingUser);
  if (existingUser) {
    console.log("Email already exists");
    return false;
  }

  //check if the user name is valid
  const existingUsername = await user.findOne({ userName: userGoingToBeCreated.userName });
  if (existingUsername) {
    console.log("Username already exists");
    return false;
  }
  
  console.log("Email is valid");
  return true;
}