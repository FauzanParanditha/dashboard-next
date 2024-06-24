import * as yup from "yup";

export const forgotValidator = yup.object().shape({
  email: yup.string().required().email("email is not valid"),
});

export const resetValidator = yup.object().shape({
  email: yup.string().required("email is required"),
  token: yup.string(),
  password: yup
    .string()
    .min(8, "min 8 character")
    .minLowercase(1, "password must contain at least 1 lower case letter")
    .minUppercase(1, "password must contain at least 1 upper case letter")
    .minNumbers(1, "password must contain at least 1 number")
    .minSymbols(1, "password must contain at least 1 special character")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "password not same"),
});
