import axios from "axios";

require("dotenv").config();
const proxy = "https://corsanywhere.herokuapp.com";
const baseURL = "https://api.yelp.com/v3/businesses";
const apiKey = process.env.REACT_APP_API_KEY;

// precondition: categories and attributes are represented as a list and comma delimited
export const getSearchResults = async (location, radius, price, categories, attributes) => {
  const res = await axios.get(`${proxy}/${baseURL}/search?limit=50`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    params: {
      location: location,
      radius: radius,
      price: price,
      categories: `restaurants${categories !== "" ? "," + categories : ""}`,
      ...(attributes !== "" ? { attributes: this.attributes } : {}),
    },
  });

  return res.data;
};
