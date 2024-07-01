import { FaTelegram } from "react-icons/fa6";
import {
  FcManager,
  FcStatistics,
  FcHome,
  FcGenealogy,
  FcPortraitMode,
  FcIdea,
  FcSettings,
  FcNook,
  FcBarChart,
  FcFeedback,
  FcVip,
} from "react-icons/fc";

export const admin = [
  {
    title: "Dashboard",
    icon: <FcHome />,
    link: "/dashboard/home",
  },
  {
    title: "IP",
    icon: <FcGenealogy />,
    link: "/dashboard/ip",
  },
  {
    title: "Admin",
    icon: <FcPortraitMode />,
    link: "/dashboard/admin",
  },
  {
    title: "Privy",
    icon: <FcVip />,
    link: "/dashboard/privy",
  },
  {
    title: "Logs",
    icon: <FcNook />,
    link: "#",
    subMenu: [
      {
        title: "Activity Logs",
        icon: <FcBarChart />,
        link: "/dashboard/logs/activity",
      },
      {
        title: "Email Logs",
        icon: <FcFeedback />,
        link: "/dashboard/logs/email",
      },
      {
        title: "Telegram Logs",
        icon: <FaTelegram />,
        link: "/dashboard/logs/telegram",
      },
    ],
  },
  {
    title: "Profile",
    icon: <FcSettings />,
    link: "/dashboard/profile",
  },
];
