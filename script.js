const cart = document.querySelector(".cart-item-product");
const cartPrice = document.querySelector(".cart-item-price");
const subtotal = document.querySelector("#subtotal-item-price");
const sSideTotal = document.querySelector("#cart-total-side");
const total = document.querySelector(".grand-total");
const input = document.querySelector("#input-id");
const checkout = document.querySelector(".checkout-button");
const deleteButton = document.querySelector(".remove-button");

const fetchFromAPi = async () => {
    try {
        const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
        const cartItemsFromApi = await response.json();

        const itemName = cartItemsFromApi.items[0].title;
        const itemPrice = cartItemsFromApi.items[0].price/ 100;
        const itemImage = cartItemsFromApi.items[0].image;
        const totalItemPriceInitial = cartItemsFromApi.original_total_price / 100;

        let savedQuantity = localStorage.getItem("quantity") ? parseInt(localStorage.getItem("quantity")) : 1;
        input.value = savedQuantity;

        let savedTotalPrice = localStorage.getItem("totalPrice") ? parseFloat(localStorage.getItem("totalPrice")) : itemPrice * savedQuantity;

        if (!localStorage.getItem("quantity")) {
            localStorage.setItem("quantity", savedQuantity);
        }
        if (!localStorage.getItem("totalPrice")) {
            localStorage.setItem("totalPrice", savedTotalPrice);
        }

        const img = document.createElement("img");
        img.setAttribute("src", itemImage);
        img.setAttribute("alt", itemName);
        img.setAttribute("width", 50);

        const span = document.createElement("span");
        span.textContent = itemName;
        
        cart.appendChild(img);
        cart.appendChild(span);
        
        cartPrice.textContent = `Rs. ${convertNumber(itemPrice)}`;
        subtotal.textContent = `Rs. ${convertNumber(savedTotalPrice)}`;
        sSideTotal.textContent = `Rs. ${convertNumber(savedTotalPrice)}`;
        total.textContent = `Rs. ${convertNumber(savedTotalPrice)}`;

        input.addEventListener("input", (event) => {
            let newQuantity = parseInt(event.target.value);
            localStorage.setItem("quantity", newQuantity);

            let newTotalPrice = itemPrice * newQuantity;
            localStorage.setItem("totalPrice", newTotalPrice);

            subtotal.textContent = `Rs. ${convertNumber(newTotalPrice)}`;
            sSideTotal.textContent = `Rs. ${convertNumber(newTotalPrice)}`;
            total.textContent = `Rs. ${convertNumber(newTotalPrice)}`;
        });

    } catch (err) {
        console.log("Error fetching data:", err);
    }
};

fetchFromAPi();

deleteButton.addEventListener("click", () => {
    cart.remove();
    cartPrice.remove();
    subtotal.remove();
    sSideTotal.remove();
    total.remove();
    input.remove();

    localStorage.removeItem("quantity");
    localStorage.removeItem("totalPrice");
});

checkout.addEventListener("click", () => {
    alert("Checkout Successful");

    localStorage.removeItem("quantity");
    localStorage.removeItem("totalPrice");
});

const convertNumber = (num) => {
    const stringNum = num.toString();
    const splitNum = stringNum.split("");
    const reverseNum = splitNum.reverse();

    for (let i = 0; i < reverseNum.length; i += 4) {
        reverseNum.splice(i, 0, ",");
    }
    reverseNum.shift()
    const joinNum = reverseNum.reverse().join("")
    return `₹${joinNum}.00`;
};
