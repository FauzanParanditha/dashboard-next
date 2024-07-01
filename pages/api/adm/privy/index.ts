import { adminHandler } from "@/server/middleware/admin-handler";
import { getAllPrivy } from "@/server/models/callback-privy";
import { NextApiRequest, NextApiResponse } from "next";

const ListPrivy = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { page, search } = req.query;
    const data = await getAllPrivy(false, {
      page: page,
      q: search,
    });
    res.json({ success: true, msg: "get data success", data });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error fetching data" });
  }
};

export default adminHandler({
  GET: ListPrivy,
});
