import { cart } from "../data/cart.js";
import { products } from "../data/products.js";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingItem;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingItem = product;
    }
  });

  console.log(matchingItem);
});
