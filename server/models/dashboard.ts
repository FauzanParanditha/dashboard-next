import connectDB from "@/server/database";
import { activityCollection } from "./log_activity";
import { adminCollection } from "./admin";
import { emailCollection } from "./log_email";
import { telegramCollection } from "./log_telegram";

export const getDashboard = async () => {
  const m = await connectDB();
  const admin = await adminCollection(m).countDocuments();
  const activity = await activityCollection(m).countDocuments();
  const email = await emailCollection(m).countDocuments();
  const telegram = await telegramCollection(m).countDocuments();
  return [
    {
      name: "Admin",
      stat: admin,
    },
    {
      name: "Activity Log",
      stat: activity,
    },
    {
      name: "Email Log",
      stat: email,
    },
    {
      name: "Telegram Log",
      stat: telegram,
    },
  ];
};
