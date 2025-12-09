let total = 0;
let cartList = document.getElementById("cartList");
let totalDisplay = document.getElementById("total");
let currentUser = null;

// Load user from localStorage on page load
window.onload = function() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateNavForUser();
  }
};

// ============ ADD TO CART (UNCHANGED + TOAST) ============
function addToCart(name, price) {
  let li = document.createElement("li");

  let itemText = document.createElement("span");
  itemText.innerText = `${name} - ₹${price}`;

  let removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove";
  removeBtn.style.cssText = "background:crimson;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;margin-left:15px;";

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

  showToast(`${name} added to cart! 🛒`);
}

// ============ TOAST ============
function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  toast.offsetHeight; // trigger reflow
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 2000);
}

// ============ AUTH FUNCTIONS ============
function openAuthModal(mode = 'login') {
  const modal = document.getElementById("authModal");
  const title = document.getElementById("modalTitle");
  const nameField = document.getElementById("signupNameField");
  const button = document.getElementById("authButton");
  const toggleText = document.getElementById("toggleText");

  if (mode === 'signup') {
    title.textContent = "Create Account";
    nameField.style.display = "block";
    button.textContent = "Sign Up";
    toggleText.innerHTML = 'Already have an account? <a href="#" onclick="openAuthModal(\'login\')">Login</a>';
  } else {
    title.textContent = "Login to Glimmer Cart";
    nameField.style.display = "none";
    button.textContent = "Login";
    toggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="openAuthModal(\'signup\')">Sign up</a>';
  }

  document.getElementById("authForm").dataset.mode = mode;
  modal.style.display = "flex";
}

function closeAuthModal() {
  document.getElementById("authModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(e) {
  const modal = document.getElementById("authModal");
  if (e.target === modal) closeAuthModal();
};

// Handle Login / Sign Up
document.getElementById("authForm").onsubmit = function(e) {
  e.preventDefault();

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const mode = this.dataset.mode;

  if (mode === "signup") {
    const name = document.getElementById("signupName").value.trim();
    if (!name) return showToast("Name is required!");

    // Save user
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email]) {
      showToast("Email already registered!");
      return;
    }
    users[email] = { name, password }; // In real app: hash password!
    localStorage.setItem("users", JSON.stringify(users));

    showToast("Account created successfully! 🎉");
  }

  // Login logic (common for both)
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (!users[email] || users[email].password !== password) {
    showToast("Invalid email or password!");
    return;
  }

  // Successful login
  currentUser = { email, name: users[email].name };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  updateNavForUser();
  closeAuthModal();
  showToast(`Welcome back, ${currentUser.name}! 🎄`);
};

// Update navigation when logged in
function updateNavForUser() {
  const userSection = document.getElementById("userSection");
  if (currentUser) {
    userSection.innerHTML = `
      <span>Welcome, <strong>${currentUser.name.split(" ")[0]}</strong>!</span>
      <button onclick="logout()" style="padding:8px 16px;background:#c2185b;color:white;border:none;border-radius:6px;cursor:pointer;">Logout</button>
    `;
  } else {
    userSection.innerHTML = `
      <a href="#" onclick="openAuthModal('login')">Login</a>
      <span>|</span>
      <a href="#" onclick="openAuthModal('signup')">Sign Up</a>
    `;
  }
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateNavForUser();
  showToast("Logged out successfully!");
}
