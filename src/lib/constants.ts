const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const DUMMY_IMAGE =
  "https://www.versaspa-europe.com/media/codazon/subcategories/placeholder/placeholder.jpg";

export { emailRegex, passwordRegex, DUMMY_IMAGE };
