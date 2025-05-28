import { cart, removeCart, updateDeliveryOption } from "/data/cart.js";
import { products, getProduct } from "/data/products.js";
import { deliveryOptions, getDeliveryOption } from "/data/deliveryOptions.js";
import { formatPrice } from "/scripts/utils/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingItem = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `<div class="cart-item-container js-item-container-${
      matchingItem.id
    }">
            <div class="delivery-date">${dateString}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingItem.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingItem.name}
                </div>
                <div class="product-price">$${formatPrice(
                  matchingItem.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete" data-product-id="${
                    matchingItem.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingItem, cartItem)}
              </div>
            </div>
          </div>`;
  });

  function deliveryOptionsHTML(matchingItem, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceStrings =
        deliveryOption.priceCents === 0
          ? "FREE "
          : `$${formatPrice(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `<div class="delivery-option js-delivery-option" data-product-id="${
        matchingItem.id
      }"
    data-delivery-option-id="${deliveryOption.id}">
          <input
            type="radio" ${isChecked ? "checked" : ""} 
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}"
          />
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceStrings} Shipping</div>
          </div>
        </div>`;
    });

    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete").forEach((deleteItem) => {
    deleteItem.addEventListener("click", () => {
      const productId = deleteItem.dataset.productId;
      removeCart(productId);

      const container = document.querySelector(
        `.js-item-container-${productId}`
      );
      container.remove();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((e) => {
    e.addEventListener("click", () => {
      const { productId, deliveryOptionId } = e.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
