import { adminHandler } from "@/server/middleware/admin-handler";
import { getAllEmail } from "@/server/models/log_email";
import { NextApiRequest, NextApiResponse } from "next";

export default adminHandler({
  GET: listEmailLog,
});

async function listEmailLog(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page, search } = req.query;
    const admins = await getAllEmail(false, {
      page: page,
      q: search,
    });
    res.status(200).json({
      code: 200,
      success: true,
      msg: "All Data Email",
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      msg: "Error fetching activity",
    });
  }
}
