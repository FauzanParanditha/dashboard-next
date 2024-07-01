import * as yup from "yup";

export const callbackSchema = yup.object().shape({
  reference_number: yup.string().max(32).required(),
  channel_id: yup.string().max(32).required(),
  info: yup.string().optional(),
  register_token: yup.string().max(32).required(),
  status: yup.string().max(20).required(),
  privy_id: yup.string().max(20).required(),
  email: yup.string().email().max(32).required(),
  phone: yup.string().max(14).required(),
  identity: yup
    .object()
    .shape({
      nama: yup.string().max(100).required(),
      nik: yup.string().max(16).required(),
      tanggalLahir: yup.string().required(),
    })
    .required(),
});
