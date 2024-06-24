import * as yup from "yup";

export const blogSchema = (isEdit) => {
  return yup.object().shape({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
    citation: yup.string().required("Citation is required"),
    categoryIds: yup
      .array()
      .of(yup.string().required("Category ID is required"))
      .min(1, "At least one category is required")
      .required("Category is required"),
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
export const jobCategorySchema = yup.object().shape({
  categoryName: yup.string().required("Name is required"),
});
