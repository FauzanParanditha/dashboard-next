import bcrypt from "bcrypt";

/*
    untuk helpers server side tidak bisa di campur dengan helper yg di gunakan di client side
*/
export const generateHashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const compareHashPassword = (pass: string, hash: string) => {
  return bcrypt.compare(pass, hash);
};
