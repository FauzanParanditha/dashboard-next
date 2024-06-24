import { adminHandler } from "@/server/middleware/admin-handler";
import { getAllActivity } from "@/server/models/log_activity";
import { NextApiRequest, NextApiResponse } from "next";

export default adminHandler({
  GET: listActivityLog,
});

async function listActivityLog(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page, search } = req.query;
    const admins = await getAllActivity(false, {
      page: page,
      q: search,
    });
    res.status(200).json({
      code: 200,
      success: true,
      msg: "All Data Activity",
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
