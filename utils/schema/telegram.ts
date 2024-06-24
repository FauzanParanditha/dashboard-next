import * as yup from "yup";

export const createTelegramSchema = yup.object().shape({
  message: yup.object().required(),
});
