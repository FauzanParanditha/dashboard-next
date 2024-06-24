import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * This sets `cookie` using the `res` object
 */
export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if (typeof options.maxAge === "number") {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }
  var headers = res.getHeader("Set-Cookie") || [];
  if (headers == undefined) {
    headers = [serialize(name, stringValue, options)];
  } else if (headers instanceof Array) {
    // multi cookies
    headers = [...headers, serialize(name, stringValue, options)];
  }
  res.setHeader("Set-Cookie", headers);
};
