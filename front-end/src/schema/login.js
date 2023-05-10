import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const loginSchema = yup.object().shape({
  user_email: yup.string().required("user name or email  is required."),
  password: yup.string().required("Password is required."),
});

const loginResolver = yupResolver(loginSchema);
export { loginSchema, loginResolver };
