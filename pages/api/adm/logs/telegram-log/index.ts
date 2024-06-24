import { adminHandler } from "@/server/middleware/admin-handler";
import { getAllTelegram } from "@/server/models/log_telegram";
import { NextApiRequest, NextApiResponse } from "next";

export default adminHandler({
  GET: listTelegramLog,
});

async function listTelegramLog(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page, search } = req.query;
    const admins = await getAllTelegram(false, {
      page: page,
      q: search,
    });
    res.status(200).json({
      code: 200,
      success: true,
      msg: "All Data Telegram",
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      msg: "Error fetching Telegram",
    });
  }
}
