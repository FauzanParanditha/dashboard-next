import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/server/database";
import { adminCollection } from "@/server/models/admin";
import { generateHashPassword } from "@/utils/password";
import { AdminStatus } from "@/utils/var";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = {
      _id: new ObjectId(),
      email: "admin@pandi.id",
      password: await generateHashPassword("Pandi123#"),
      _created: new Date(),
      _modified: new Date(),
      status: AdminStatus.ACTIVE,
      fullName: "Admin",
    };

    //create admin
    const m = await connectDB();
    const result = await adminCollection(m).insertOne(data);
    res.status(201).json({
      message: "Admin insert successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create admin" });
  }
}
