import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const createPostSchema = yup.object().shape({
  //   comment: yup
  //     .string()
  //     .required("field  is required.")
  //     .max(300, "The maximum number of comment is 300"),

  location: yup.string().nullable(),

  caption: yup
    .string()
    .nullable()
    .max(600, "The maximum number of comment is 600"),

//   upload: yup.string().required("field  is required."),
});

const createPostResolver = yupResolver(createPostSchema);
export { createPostSchema, createPostResolver };
