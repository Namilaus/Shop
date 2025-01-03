// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];


function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateQuantity(index, change) {
    if (cart[index].quantity + change >= 1) {
        cart[index].quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart and come back!</p>
            </div>
        `;
        updateCartTotals(0);
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="item-quantity">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Calculate subtotal only
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateCartTotals(subtotal);
}

function updateCartTotals(subtotal) {
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
}



function showToastNotification(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);

    // Animate cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('pulse');
    
    // Remove animations after delay
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 300);
        cartIcon.classList.remove('pulse');
    }, 3000);
}

function checkout() {
    if (cart.length === 0) {
        showToastNotification('Your cart is empty!');
        return;
    }
    
    window.location.href = '../checkout/checkout.html';
    showToastNotification('Thank you for your purchase! 🎉');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartNotification();
}

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
}); 