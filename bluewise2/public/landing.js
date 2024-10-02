// Function to change background image to a single image
function setBackground(image) {
    // Ensure correct selector for class
    document.querySelector('.hero-section').style.backgroundImage = `url(${image})`;
}

// Set the background image
const backgroundImage = "img4.jpg";  // Add the correct path to your image
setBackground(backgroundImage);  // Call the function to set the background



function openGoogleMaps() {
    window.open("https://maps.google.com", "_blank");
}

function callOnYourWay() {
    alert("Calling your way...");
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Message Sent!");
});
