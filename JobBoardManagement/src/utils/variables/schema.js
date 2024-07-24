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

export const quizSchema = (isEdit) => {
  return yup.object().shape({
    title: yup
      .string()
      .required('Title is required')
      .max(50, 'Title must be less than 50 characters.'),
    description: yup.string().required('Description is required'),
    imageFile: isEdit
      ? yup.mixed().nullable()
      : yup
          .mixed()
          .test('required', 'You need to provide a file', (file) => {
            if (file) return true;
            return false;
          })
          .test('fileSize', 'The file is too large', (file) => {
            return file && file.size <= 2000000; // 2MB limit
          }),
  });
};
export const categoryQuizSchema = yup.object().shape({
  name: yup.string().required("Category name is required").min(2, "Name must be at least 2 characters long").max(50, "Name can't be longer than 50 characters"),
});