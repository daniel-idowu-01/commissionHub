const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const DUMMY_IMAGE =
  "https://www.versaspa-europe.com/media/codazon/subcategories/placeholder/placeholder.jpg";

const CATEGORIES = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home-kitchen", name: "Home & Kitchen" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "health", name: "Health & Wellness" },
  { id: "groceries", name: "Groceries" },
  { id: "baby-products", name: "Baby & Kids" },
  { id: "books", name: "Books & Media" },
  { id: "automotive", name: "Automotive" },
  { id: "office-supplies", name: "Office" },
  { id: "pet-supplies", name: "Pets" },
];

export { emailRegex, passwordRegex, DUMMY_IMAGE, CATEGORIES };
