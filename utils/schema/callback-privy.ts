import * as yup from "yup";

const rejectReasonSchema = yup.object().shape({
  reason: yup.string().required(),
  code: yup.string().required(),
});

export const callbackSchema = yup.object().shape({
  reference_number: yup.string().max(32).required(),
  channel_id: yup.string().max(32).required(),
  info: yup.string().optional(),
  register_token: yup.string().when("status", {
    is: "verified",
    then: (schema) => schema.max(32).required(),
    otherwise: (schema) => schema.length(16).required(),
  }),
  status: yup.string().oneOf(["verified", "rejected"]).required(),
  privy_id: yup
    .string()
    .max(20)
    .when("status", {
      is: "verified",
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
  email: yup
    .string()
    .email()
    .max(32)
    .when("status", {
      is: "verified",
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
  phone: yup
    .string()
    .max(14)
    .when("status", {
      is: "verified",
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
  identity: yup
    .object()
    .shape({
      nama: yup.string().max(100).required(),
      nik: yup.string().max(16).required(),
      tanggalLahir: yup.string().required(),
    })
    .when("status", {
      is: "verified",
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
  reject_reason: rejectReasonSchema.when("status", {
    is: "rejected",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  resend: yup.boolean().optional(),
});
