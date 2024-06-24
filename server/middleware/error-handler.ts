import jwt from "jsonwebtoken";

export const errorHandler = (err: any, res: any) => {
  if (typeof err === "string") {
    // custom application error
    const is404 = err.toLowerCase().endsWith("not found");
    const statusCode = is404 ? 404 : 400;
    return res.status(statusCode).json({ msg: err });
  }

  if (err.name === "UnauthorizedError") {
    if (err.inner instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ code: err.status, msg: "jwt expired" });
    }
    // jwt authentication error
    return res.status(401).json({ code: err.status, msg: err.code });
  }

  // default to 500 server error
  // console.error(err)
  return res.status(500).json({ code: 500, msg: err.message });
};
