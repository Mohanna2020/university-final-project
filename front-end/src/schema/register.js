import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("user name is required.")
    .min(3, "The minimum number of user name is  3"),
  name: yup
    .string()
    .nullable()
    .max(20, "The maximum number of name is  20"),
  email: yup
    .string()
    .email("Email is not corrent")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(5, "The minimum number of password is 5")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      "password must contain letters and numbers"
    ),
  confirmPass: yup.string().required("Confirm password is required."),
});

const registerResolver = yupResolver(registerSchema);
export { registerSchema, registerResolver };
