let total = 0;
let cartList = document.getElementById("cartList");
let totalDisplay = document.getElementById("total");

function addToCart(name, price) {
  let li = document.createElement("li");

  let itemText = document.createElement("span");
  itemText.innerText = `${name} - ₹${price}`;

  let removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove";
  removeBtn.style.background = "crimson";
  removeBtn.style.color = "white";
  removeBtn.style.border = "none";
  removeBtn.style.padding = "6px 12px";
  removeBtn.style.borderRadius = "6px";
  removeBtn.style.cursor = "pointer";

  removeBtn.onclick = function () {
    cartList.removeChild(li);
    total -= price;
    totalDisplay.textContent = total;
  };

  li.appendChild(itemText);
  li.appendChild(removeBtn);
  cartList.appendChild(li);

  total += price;
  totalDisplay.textContent = total;
}
