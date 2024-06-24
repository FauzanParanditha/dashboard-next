import { useCallback } from "react";
import * as Yup from "yup";

export const validate = async <T>(y: Yup.ObjectSchema<any>, values: any) => {
  const errors: any = {};
  let result: T = {} as any;
  try {
    result = await y.noUnknown().validateSync(values, {
      abortEarly: false,
      strict: true,
    });

    return { result, errors: null };
  } catch (e: any) {
    if (e.inner) {
      if (e.inner.length === 0) {
        return { [e.path || "err"]: e.message };
      }

      for (let err of e.inner) {
        errors[err.path || "msg"] = err.message;
      }
      return { result: null, errors };
    }
  }
  return { result, errors: null };
};

// @ts-ignore
export const useYupValidationResolver = (validationSchema) =>
  useCallback(
    // @ts-ignore
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return { values, errors: {} };
      } catch (errors) {
        return {
          values: {},
          // @ts-ignore
          errors: errors.inner.reduce(
            // @ts-ignore
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

export const colorValidate = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
