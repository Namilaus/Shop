import {productDetails} from '/data.js';

function changeImage(thumbnail, newSrc) {
    const mainImage = document.getElementById('mainImage');
    mainImage.style.opacity = 0;
    setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = 1;
    }, 300);
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}
function getProductData(){
    //set fotos
    const foto4 = document.getElementById("thumbnail4");
    const foto3 = document.getElementById("thumbnail3");
    const foto2 = document.getElementById("thumbnail2");
    const foto1 = document.getElementById("thumbnail1");
    const fotoMain = document.getElementById("mainImage");
    
    // Set image sources
    fotoMain.src = productDetails.mainImage;
    foto1.src = productDetails.thumbnail1;
    foto2.src = productDetails.thumbnail2;
    foto3.src = productDetails.thumbnail3;
    foto4.src = productDetails.thumbnail4;
    
    // Add click event listeners
    foto1.addEventListener('click', () => changeImage(foto1, productDetails.thumbnail1));
    foto2.addEventListener('click', () => changeImage(foto2, productDetails.thumbnail2));
    foto3.addEventListener('click', () => changeImage(foto3, productDetails.thumbnail3));
    foto4.addEventListener('click', () => changeImage(foto4, productDetails.thumbnail4));
    
    //set title and etc
    document.getElementsByClassName("product-title")[0].textContent = productDetails.name;
    document.getElementsByClassName("product-price")[0].textContent = productDetails.price + "$";
    document.getElementsByClassName("product-description")[0].textContent = productDetails.description;
}
getProductData();




// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate features on scroll
const features = document.querySelectorAll('.feature');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

features.forEach(feature => {
    observer.observe(feature);
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartNotification();
    showToastNotification('Product added to cart! 🛍️');
}

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartNotification();
});

// Update the existing add-to-cart button click handler
document.querySelector('.add-to-cart')?.addEventListener('click', () => {
    const product = {
        name: document.querySelector('.product-title').textContent,
        price: parseFloat(document.querySelector('.product-price').textContent.replace('$', '')),
        quantity: parseInt(document.getElementById('quantity').value),
        image: document.getElementById('mainImage').src,
        description: document.querySelector('.product-description').textContent.slice(0, 100) + '...'
    };
    addToCart(product);

});

function updateCartNotification() {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        notification.textContent = totalItems;
        
        if (totalItems > 0) {
            notification.classList.add('active');
        } else {
            notification.classList.remove('active');
        }
    }
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