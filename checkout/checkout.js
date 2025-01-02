import config from '../config.js';

let autocomplete;
let map;
let marker;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById('map-container'), {
        center: { lat: 51.1657, lng: 10.4515 }, // Center of Germany
        zoom: 6,
        mapTypeControl: false
    });

    // Initialize the marker using AdvancedMarkerElement
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: 51.1657, lng: 10.4515 },
        draggable: true,
        title: 'Delivery Location'
    });

    // Initialize autocomplete
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location-input'),
        {
            types: ['address'],
            componentRestrictions: { country: 'DE' } // Restrict to Germany
        }
    );

    // Add listener for place selection
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    const place = autocomplete.getPlace();
    
    if (!place.geometry) {
        window.alert("No details available for this address");
        return;
    }

    // Update marker position using setPosition for basic marker
    marker.setPosition(place.geometry.location);
    map.setCenter(place.geometry.location);
    map.setZoom(17);

    // Clear out the old values
    document.getElementById('locality-input').value = '';
    document.getElementById('administrative_area_level_1-input').value = '';
    document.getElementById('postal_code-input').value = '';
    document.getElementById('country-input').value = '';

    // Get each component of the address from the place details
    for (const component of place.address_components) {
        const componentType = component.types[0];

        switch (componentType) {
            case 'locality':
                document.getElementById('locality-input').value = component.long_name;
                break;
            case 'administrative_area_level_1':
                document.getElementById('administrative_area_level_1-input').value = component.long_name;
                break;
            case 'postal_code':
                document.getElementById('postal_code-input').value = component.long_name;
                break;
            case 'country':
                document.getElementById('country-input').value = component.long_name;
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load and display order summary
    displayOrderSummary();

    // Handle form submission
    document.getElementById('shippingForm').addEventListener('submit', handleSubmit);
    
    // Load Google Maps script with API key from config and error handling
    loadGoogleMapsScript();
});

function loadGoogleMapsScript() {
    const script = document.createElement('script');
    // Update the script URL to include the marker library and use async loading
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&libraries=places,marker&v=beta&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
        console.error('Failed to load Google Maps script');
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-map-marker-alt" style="font-size: 2em; color: var(--accent-color);"></i>
                    <p>Failed to load map. Please check your internet connection or try disabling ad blockers.</p>
                </div>
            `;
        }
    };

    window.initMap = async function() {
        try {
            // Initialize the map with a Map ID
            map = new google.maps.Map(document.getElementById('map-container'), {
                center: { lat: 51.1657, lng: 10.4515 },
                zoom: 6,
                mapTypeControl: false,
                fullscreenControl: true,
                streetViewControl: false,
                zoomControl: true,
                mapId: '8f348cef7d4781df'
            });

            // Create a basic marker instead of AdvancedMarkerElement
            marker = new google.maps.Marker({
                map: map,
                position: { lat: 51.1657, lng: 10.4515 },
                draggable: true,
                title: 'Delivery Location'
            });

            // Initialize autocomplete with error handling
            try {
                autocomplete = new google.maps.places.Autocomplete(
                    document.getElementById('location-input'),
                    {
                        types: ['address'],
                        componentRestrictions: { country: 'DE' }
                    }
                );
                autocomplete.addListener('place_changed', fillInAddress);
            } catch (error) {
                console.error('Error initializing Places Autocomplete:', error);
                showToastNotification('Address autocomplete is not available. Please enter address manually.');
            }
        } catch (error) {
            console.error('Error initializing Google Maps:', error);
            const mapContainer = document.getElementById('map-container');
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2em; color: #ff6b6b;"></i>
                        <p>Failed to initialize map. Please refresh the page or try again later.</p>
                    </div>
                `;
            }
        }
    };

    document.head.appendChild(script);
}

function displayOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    let summaryHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHTML += `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    summaryHTML += `
        <div class="summary-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;

    orderSummary.innerHTML = summaryHTML;
}

function handleSubmit(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('location-input').value,
        apartment: document.getElementById('apartment').value,
        city: document.getElementById('locality-input').value,
        state: document.getElementById('administrative_area_level_1-input').value,
        zipCode: document.getElementById('postal_code-input').value,
        country: document.getElementById('country-input').value
    };

    // Get cart data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Combine order data
    const orderData = {
        ...formData,
        cart,
        total,
        orderDate: new Date().toISOString()
    };

    // Log the order data (in real app, this would be sent to a server)
    console.log('Order Data:', orderData);
    
    // Show success message
    showToastNotification('Order submitted successfully! Redirecting to payment...');
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Redirect to success page or payment gateway
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 2000);
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

    // Remove toast after delay
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
} 