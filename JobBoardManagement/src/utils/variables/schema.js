import * as yup from "yup";

export const blogSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  blogCategoryId: yup.string().required("Category is required"),
  image: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      if (file) return true;
      return false;
    })
    .test("fileSize", "The file is too large", (file) => {
      return file && file.size <= 2000000;
    }),
});

export const blogCategorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});
