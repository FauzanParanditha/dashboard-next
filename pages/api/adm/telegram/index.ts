import { adminHandler } from "@/server/middleware/admin-handler";
import { ActivityLog, createActivityLog } from "@/server/models/log_activity";
import { TelegramLog, createTelegramLog } from "@/server/models/log_telegram";
import { ResponseError, ResponseSuccess } from "@/utils/response";
import { createTelegramSchema } from "@/utils/schema/telegram";
import { validate } from "@/utils/validate";
import axios from "axios";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const sendTelegram = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // console.log(req.body);
    const { errors } = await validate(createTelegramSchema, req.body);
    if (errors != null) {
      return ResponseError(res, 422, "input invalid", errors);
    }

    const messageString = `Do: ${req.body.message.do}\nTime: ${req.body.message.do_time}\nEmail: ${req.body.message.data.email}\nFullName: ${req.body.message.data.fullName}`;
    // console.log(messageString);
    const TELEGRAM_API_BASE_URL = "https://api.telegram.org/bot";
    const chatId = process.env.CHAT_ID;

    const telegramApiUrl = `${TELEGRAM_API_BASE_URL}${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramApiResponse = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: messageString,
    });

    if (telegramApiResponse.data.ok) {
      //create
      const data: TelegramLog = {
        _id: new ObjectId(),
        _created: new Date(),
        _modified: new Date(),
        data: {
          chatId: chatId,
          message: messageString,
        },
        do_time: new Date(),
        do: "Send Telegram",
      };

      await createTelegramLog(data);

      ResponseSuccess(res, "send telegram success", null);
    } else {
      ResponseError(
        res,
        500,
        "failed to send telegram message",
        telegramApiResponse.data
      );
    }
  } catch (error) {
    ResponseError(res, 500, "internal server error", error);
  }
};

export default adminHandler({ POST: sendTelegram });
