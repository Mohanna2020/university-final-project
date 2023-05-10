import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const commentSchema = yup.object().shape({
  comment: yup
    .string()
    .required("field  is required.")
    .max(300, "The maximum number of comment is 300"),
});

const commentResolver = yupResolver(commentSchema);
export { commentSchema, commentResolver };
