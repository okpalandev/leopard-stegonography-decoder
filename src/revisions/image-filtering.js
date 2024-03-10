const filterCanvas = document.getElementById('image-processing');
const filterCtx = filterCanvas.getContext('2d');


// Function to draw the sepia filter on the canvas
function applySepiaFilter(img) {
    // Clear the canvas
    filterCtx.clearRect(0, 0, filterCanvas.width, filterCanvas.height);

    // Draw the background image
    filterCtx.drawImage(img, 0, 0, filterCanvas.width, filterCanvas.height);

    const sepiaData = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
    const sepia = sepiaData.data;

    // Calculate the region above the slider
    const regionY = 0; // Start from the top of the canvas
    const regionHeight = slider.y + slider.height / 2 - slider.height; // End at the current slider position plus half its height

    for (let y = regionY; y < regionHeight; y++) {
        // Calculate sepia intensity based on slider position
        let intensity = ((y - regionY) / (regionHeight - regionY)) * 100; // Normalize intensity based on region height

        for (let x = 0; x < filterCanvas.width; x++) {
            const i = (y * filterCanvas.width + x) * 4;
            const avg = (sepia[i] + sepia[i + 1] + sepia[i + 2]) / 3;
            sepia[i] = avg + intensity; // Red
            sepia[i + 1] = avg + intensity * 0.5; // Green
            sepia[i + 2] = avg; // Blue
        }
    }

    filterCtx.putImageData(sepiaData, 0, 0, 0, 0, filterCanvas.width, filterCanvas.height);
}

// Function to update the sepia filter and draw the tracker when slider moves
function updateSepiaFilter(event) {
    const rect = filterCanvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    slider.y = Math.min(Math.max(mouseY, slider.height / 2), filterCanvas.height - slider.height / 2);
    applySepiaFilter(img);
}

// Function to draw the image without affecting the slider
function drawFilter(img) {
    img.onload = () => {
        filterCtx.drawImage(img, 0, 0, filterCanvas.width, filterCanvas.height);
        applySepiaFilter(img);
    };
}

// Event listeners for slider movement
filterCanvas.addEventListener('mousemove', updateSepiaFilter);
filterCanvas.addEventListener('touchmove', updateSepiaFilter);
filterCanvas.addEventListener('mousedown', updateSepiaFilter);

// Load the image and draw the filter
const img = new Image();
img.src = './assets/leopard.png'; 
drawFilter(img);
