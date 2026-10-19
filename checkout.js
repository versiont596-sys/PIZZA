(() => {
  const list = document.querySelector(".list");
  const quantityTotal = document.querySelector(".totalQuantity");
  const priceTotal = document.querySelector(".totalPrice");
  const form = document.querySelector("#checkoutForm");
  const submitButton = form.querySelector(".buttoncheckout");
  const status = document.querySelector(".checkoutStatus");

  function renderItems() {
    const items = window.PizzeriaCart.getItems();
    list.replaceChildren();
    let totalQuantity = 0;
    let totalPrice = 0;

    items.forEach(product => {
      totalQuantity += product.quantity;
      totalPrice += product.price * product.quantity;

      const item = document.createElement("article");
      item.className = "item";
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = `${product.name} pizza`;
      const info = document.createElement("div");
      info.className = "info";
      const name = document.createElement("p");
      name.className = "name";
      name.textContent = product.name;
      const quantity = document.createElement("p");
      quantity.textContent = `Quantity: ${product.quantity}`;
      const price = document.createElement("p");
      price.textContent = `$${(product.price * product.quantity).toFixed(2)}`;
      info.append(name, quantity, price);
      item.append(image, info);
      list.appendChild(item);
    });

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "emptyCheckout";
      empty.textContent = "Your cart is empty. Choose a pizza before checking out.";
      list.appendChild(empty);
      status.textContent = "Add a pizza to your cart to continue.";
    }

    quantityTotal.textContent = String(totalQuantity);
    priceTotal.textContent = `$${totalPrice.toFixed(2)}`;
    submitButton.disabled = items.length === 0;
    return items.length > 0;
  }

  try {
    renderItems();
  } catch (error) {
    status.textContent = `Could not load your cart: ${error.message}`;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    try {
      if (!renderItems()) return;
      window.PizzeriaCart.clear();
      renderItems();
      form.reset();
      status.textContent = "Your details are valid. This demo does not transmit orders or process payments.";
    } catch (error) {
      status.textContent = `Could not complete checkout: ${error.message}`;
    }
  });
})();
