(() => {
  const products = [
    { id: "margherita", name: "Margherita", price: 50, image: "images/1.webp", description: "Tomato, mozzarella and fresh basil." },
    { id: "pepperoni", name: "Pepperoni", price: 60, image: "images/2.webp", description: "A generous serving of pepperoni and mozzarella." },
    { id: "classic", name: "Classic Cheese", price: 50, image: "images/3.webp", description: "Golden cheese with our house tomato sauce." },
    { id: "garden", name: "Garden Veggie", price: 150, image: "images/4.webp", description: "A colorful mix of fresh vegetables and cheese." },
    { id: "supreme", name: "Supreme", price: 250, image: "images/5.webp", description: "A loaded favorite with savory toppings." },
    { id: "special", name: "House Special", price: 90, image: "images/6.webp", description: "A house-made combination for your next pizza night." }
  ];
  const productById = new Map(products.map(product => [product.id, product]));
  const storageKey = "pizzeria-cart";

  function getItems() {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("Saved cart data is invalid.");

    return parsed.map(item => {
      const product = item && productById.get(item.id);
      if (!product || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
        throw new Error("Saved cart data is invalid. Clear your browser storage to start a new cart.");
      }
      return { ...product, quantity: item.quantity };
    });
  }

  function saveItems(items) {
    localStorage.setItem(storageKey, JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity }))));
  }

  window.PizzeriaCart = {
    products,
    getItems,
    saveItems,
    clear: () => localStorage.removeItem(storageKey)
  };

  const list = document.querySelector(".listProduct");
  if (!list) return;

  const cart = document.querySelector(".cart");
  const cartButton = document.querySelector(".iconCart");
  const closeButton = document.querySelector(".close");
  const cartList = document.querySelector(".listCart");
  const totalQuantity = document.querySelector(".totalQuantity");
  const status = document.querySelector(".cartStatus");
  const searchInput = document.querySelector("#productSearch");
  const sortSelect = document.querySelector("#productSort");
  const menuCount = document.querySelector(".menuCount");
  const cartToast = document.querySelector(".cartToast");
  let cartToastTimeout;

  function announce(message) {
    status.textContent = message;
  }

  function renderProducts() {
    const searchTerm = searchInput.value.trim().toLocaleLowerCase();
    const visibleProducts = products.filter(product =>
      `${product.name} ${product.description}`.toLocaleLowerCase().includes(searchTerm)
    );
    const sortOrder = sortSelect.value;
    if (sortOrder === "price-low") visibleProducts.sort((first, second) => first.price - second.price);
    else if (sortOrder === "price-high") visibleProducts.sort((first, second) => second.price - first.price);
    else if (sortOrder === "name") visibleProducts.sort((first, second) => first.name.localeCompare(second.name));

    list.replaceChildren();
    menuCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "pizza" : "pizzas"}`;

    if (visibleProducts.length === 0) {
      const empty = document.createElement("p");
      empty.className = "noProducts";
      empty.textContent = "No pizzas match that search. Try another name.";
      list.appendChild(empty);
      return;
    }

    visibleProducts.forEach(product => {
      const item = document.createElement("article");
      item.className = "item";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = `${product.name} pizza`;
      image.loading = "lazy";

      const title = document.createElement("h2");
      title.textContent = product.name;

      const description = document.createElement("p");
      description.textContent = product.description;

      const price = document.createElement("p");
      price.className = "price";
      price.textContent = `$${product.price.toFixed(2)}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "addToCart";
      button.dataset.productId = product.id;
      button.textContent = "Add to cart";
      button.setAttribute("aria-label", `Add ${product.name} pizza to cart`);

      item.append(image, title, description, price, button);
      list.appendChild(item);
    });
  }

  function renderCart() {
    const items = getItems();
    cartList.replaceChildren();
    let count = 0;
    let subtotal = 0;

    items.forEach(product => {
      count += product.quantity;
      subtotal += product.price * product.quantity;
      const item = document.createElement("article");
      item.className = "item";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";

      const content = document.createElement("div");
      content.className = "content";
      const name = document.createElement("p");
      name.className = "name";
      name.textContent = product.name;
      const price = document.createElement("p");
      price.className = "price";
      price.textContent = `$${product.price.toFixed(2)} each`;
      content.append(name, price);

      const quantity = document.createElement("div");
      quantity.className = "quantity";
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.dataset.action = "decrease";
      decrease.dataset.productId = product.id;
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Remove one ${product.name}`);
      const value = document.createElement("span");
      value.textContent = String(product.quantity);
      const increase = document.createElement("button");
      increase.type = "button";
      increase.dataset.action = "increase";
      increase.dataset.productId = product.id;
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Add one ${product.name}`);
      quantity.append(decrease, value, increase);

      item.append(image, content, quantity);
      cartList.appendChild(item);
    });

    totalQuantity.textContent = String(count);
    document.querySelector(".cartTotal").textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector(".cartEmpty").hidden = items.length > 0;
    const checkoutLink = document.querySelector(".checkoutLink");
    checkoutLink.setAttribute("aria-disabled", String(items.length === 0));
    checkoutLink.tabIndex = items.length === 0 ? -1 : 0;
  }

  function hideCartToast() {
    window.clearTimeout(cartToastTimeout);
    cartToast.classList.remove("is-visible");
    cartToast.setAttribute("aria-hidden", "true");
    cartToast.inert = true;
  }

  function showCartToast(product, items) {
    const addedItem = items.find(item => item.id === product.id);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartToast.querySelector(".cartToastImage").src = product.image;
    cartToast.querySelector(".cartToastImage").alt = "";
    cartToast.querySelector(".cartToastName").textContent = product.name;
    cartToast.querySelector(".cartToastQuantity").textContent =
      `${addedItem.quantity} ${addedItem.quantity === 1 ? "pizza" : "pizzas"} in your cart · ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"} total`;
    cartToast.querySelector(".cartToastTotal strong").textContent = `$${subtotal.toFixed(2)}`;
    cartToast.classList.add("is-visible");
    cartToast.setAttribute("aria-hidden", "false");
    cartToast.inert = false;

    window.clearTimeout(cartToastTimeout);
    cartToastTimeout = window.setTimeout(hideCartToast, 5000);
    announce(`${product.name} added. ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"} in your cart. Cart total: $${subtotal.toFixed(2)}.`);
  }

  function animatePizzaToCart(button) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const source = button.closest(".item").querySelector("img");
    const sourceBounds = source.getBoundingClientRect();
    const targetBounds = cartButton.getBoundingClientRect();
    if (!sourceBounds.width || !targetBounds.width) return;

    const size = 58;
    const startX = sourceBounds.left + sourceBounds.width / 2 - size / 2;
    const startY = sourceBounds.top + sourceBounds.height / 2 - size / 2;
    const endX = targetBounds.left + targetBounds.width / 2 - startX - size / 2;
    const endY = targetBounds.top + targetBounds.height / 2 - startY - size / 2;
    const flyer = document.createElement("img");
    flyer.className = "cartFlyImage";
    flyer.src = source.src;
    flyer.alt = "";
    flyer.setAttribute("aria-hidden", "true");
    flyer.draggable = false;
    flyer.style.left = `${startX}px`;
    flyer.style.top = `${startY}px`;
    flyer.style.width = `${size}px`;
    flyer.style.height = `${size}px`;
    document.body.appendChild(flyer);

    if (typeof flyer.animate !== "function") {
      flyer.remove();
      return;
    }

    const animation = flyer.animate([
      { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)", opacity: 1 },
      { offset: 0.62, transform: `translate3d(${endX * 0.68}px, ${endY * 0.68}px, 0) scale(0.82) rotate(85deg)`, opacity: 0.96 },
      { transform: `translate3d(${endX}px, ${endY}px, 0) scale(0.12) rotate(160deg)`, opacity: 0.1 }
    ], {
      duration: 720,
      easing: "cubic-bezier(.2, .72, .28, 1)",
      fill: "forwards"
    });
    animation.onfinish = () => flyer.remove();
  }

  function setCartOpen(open) {
    if (open) hideCartToast();
    cart.classList.toggle("is-open", open);
    cart.setAttribute("aria-hidden", String(!open));
    cart.inert = !open;
    cartButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("cart-open", open);
    if (open) closeButton.focus();
    else cartButton.focus();
  }

  cart.inert = true;
  searchInput.addEventListener("input", renderProducts);
  sortSelect.addEventListener("change", renderProducts);
  renderProducts();
  try {
    renderCart();
  } catch (error) {
    announce(`Could not load your cart: ${error.message}`);
  }

  cartButton.addEventListener("click", () => setCartOpen(true));
  closeButton.addEventListener("click", () => setCartOpen(false));
  document.querySelector(".cartBackdrop").addEventListener("click", () => setCartOpen(false));
  cartToast.querySelector(".cartToastClose").addEventListener("click", hideCartToast);
  cartToast.querySelector(".cartToastView").addEventListener("click", () => setCartOpen(true));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cart.classList.contains("is-open")) setCartOpen(false);
    else if (event.key === "Escape" && cartToast.classList.contains("is-visible")) hideCartToast();
  });

  list.addEventListener("click", event => {
    const button = event.target.closest(".addToCart");
    if (!button) return;

    try {
      const items = getItems();
      const existing = items.find(item => item.id === button.dataset.productId);
      if (existing) existing.quantity += 1;
      else {
        const product = productById.get(button.dataset.productId);
        if (!product) throw new Error("That product is not available.");
        items.push({ ...product, quantity: 1 });
      }
      saveItems(items);
      renderCart();
      animatePizzaToCart(button);
      cartButton.classList.remove("has-new-item");
      void cartButton.offsetWidth;
      cartButton.classList.add("has-new-item");
      window.setTimeout(() => cartButton.classList.remove("has-new-item"), 550);
      showCartToast(productById.get(button.dataset.productId), items);
    } catch (error) {
      announce(`Could not update your cart: ${error.message}`);
    }
  });

  cartList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    try {
      const items = getItems();
      const item = items.find(product => product.id === button.dataset.productId);
      if (!item) return;
      if (button.dataset.action === "increase") item.quantity += 1;
      else if (button.dataset.action === "decrease") item.quantity -= 1;
      const updated = items.filter(product => product.quantity > 0);
      saveItems(updated);
      renderCart();
      announce("Cart updated.");
    } catch (error) {
      announce(`Could not update your cart: ${error.message}`);
    }
  });
})();
