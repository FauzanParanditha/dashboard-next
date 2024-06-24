import { Db, ObjectId } from "mongodb";
import { BaseModel } from ".";
import connectDB from "@/server/database";

export interface VerifiedToken extends BaseModel {
  admin_id: ObjectId;
  token: string;
}

export const tokenCollection = (db: Db) =>
  db.collection<VerifiedToken>("verified_token");

//find by id
export const findTokenById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await tokenCollection(m).findOne({ _id: id });
  return result;
};

// find by token
export const findTokenByToken = async (token: string) => {
  const m = await connectDB();
  const result = await tokenCollection(m).findOne({ token: token });
  return result;
};

//create Token
export const createToken = async (data: VerifiedToken) => {
  const m = await connectDB();
  const result = await tokenCollection(m).insertOne(data);
  return result;
};

export const deleteTokenById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await tokenCollection(m).deleteOne({
    _id: id,
  });
  return result;
};
