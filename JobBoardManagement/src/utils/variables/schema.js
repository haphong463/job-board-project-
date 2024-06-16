import * as yup from "yup";

export const blogSchema = (isEdit) => {
  return yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .max(50, "Title must be less than 50 characters."),
    content: yup.string().required("Content is required"),
    citation: yup.string().required("Citation is required"),
    blogCategoryId: yup.string().required("Category is required"),
    status: yup.string().required("Status is required"),
    image: isEdit
      ? yup.mixed().nullable()
      : yup
          .mixed()
          .test("required", "You need to provide a file", (file) => {
            if (file) return true;
            return false;
          })
          .test("fileSize", "The file is too large", (file) => {
            return file && file.size <= 2000000;
          }),
  });
};

export const blogCategorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});
