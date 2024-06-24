import { adminHandler } from "@/server/middleware/admin-handler";
import { getDashboard } from "@/server/models/dashboard";
import { NextApiRequest, NextApiResponse } from "next";

export default adminHandler({
  GET: Dashboard,
});

async function Dashboard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await getDashboard();
    res.status(200).json({
      code: 200,
      success: true,
      msg: "All Data Dashboard",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      msg: "Error fetching dashboard",
    });
  }
}
