// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { verifySignature } from "@/utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

type Data = {
  data: any;
  message: string;
};

const payload = {
  reference_number: "PRVID0000000002",
  channel_id: "002",
  info: "randomstring",
  register_token: "40a20bb2ac0aac07e34351b2a2e5f58",
  status: "verified",
  privy_id: " DHIM0472",
  email: "dhimas.email@gmail.com",
  phone: "62895630369573",
  identity: {
    nama: "Dhimas Pramudya",
    nik: "3302185203930001",
    tanggalLahir: "1993-03-12",
  },
};

const secret = "UGFuZGl4UHJpdnkhMTAyMiM=";

const signature = crypto
  .createHmac("sha256", secret)
  .update(JSON.stringify(payload))
  .digest("hex");

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    data: signature,
    message: "pong",
  });
}
