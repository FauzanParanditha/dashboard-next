import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { getAdminLogin } from "@/server/middleware/jwt-middlerware";

const getMe = async (req: NextApiRequest, res: NextApiResponse) => {
  const admin = await getAdminLogin(req);
  if (admin) {
    admin.password = "none";
    return res.json({
      data: admin,
    });
  }
  return res.json({ data: null });
};

export default adminHandler({ GET: getMe });
