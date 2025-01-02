function checkout() {
    if (cart.length === 0) {
        showToastNotification('Your cart is empty!');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = './checkout/checkout.html';
} 