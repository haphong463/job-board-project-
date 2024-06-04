export const createFormData = (data) => {
  const formData = new FormData();

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (key === "variants" || key === "carts") {
        console.log(">>>>> variant: ", value);
        // If the value is an array of objects, iterate through the array
        value.forEach((obj, index) => {
          // Append each property of the object with a unique key
          Object.entries(obj).forEach(([objKey, objValue]) => {
            formData.append(`${key}[${index}][${objKey}]`, objValue);
          });
        });
      } else {
        if (Array.isArray(value)) {
          console.log(">>>>> key !== variants: ", value);
          // If the value is a regular array, append each element
          value.forEach((element) => {
            formData.append(`${key}`, element);
          });
        } else {
          // If not an array, append the value
          formData.append(key, value);
        }
      }
    }
  }

  return formData;
};
