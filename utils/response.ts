import { NextApiRequest, NextApiResponse } from "next";

export interface Response {
  msg?: string;
  success: boolean;
  data?: any;
  error?: any;
}

export const ResponseSuccess = (
  res: NextApiResponse,
  msg: string = "Get Data Success",
  data: any
): void => {
  const response: Response = {
    success: true,
    msg,
    data,
  };
  res.json(response);
};

export const ResponseError = (
  res: NextApiResponse,
  statusCode: number = 500,
  msg: string = "internal server error",
  error: any
): void => {
  const response: Response = {
    success: false,
    msg,
    error,
  };
  res.status(statusCode).json(response);
};
