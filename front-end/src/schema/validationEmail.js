import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationEmailSchema = yup.object().shape({
  code: yup
    .string()
    .required("code is required.")
});

const validationEmailResolver = yupResolver(validationEmailSchema);
export { validationEmailSchema, validationEmailResolver };
