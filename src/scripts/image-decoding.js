const dropArea = document.getElementById('image-processing');
const dropCtx = dropArea.getContext('2d');

const input = document.createElement('input');
input.setAttribute('type', 'file');
input.style.display = 'none';

dropArea.appendChild(input);

let imageLoaded = false; // Flag to check if an image is loaded

const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length) {
        input.files = files;
        handleFile(files[0]);
    }
};

const handleDragOver = (e) => {
    e.preventDefault();
};

const handleInput = () => {
    const files = input.files;
    if (files.length) {
        handleFile(files[0]);
    }
};

const handleFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
            drawImageOnCanvas(image);
            imageLoaded = true;
        };
    };
};

const drawImageOnCanvas = (image) => {
    dropCtx.clearRect(0, 0, dropArea.width, dropArea.height);
    dropCtx.drawImage(image, 0, 0, dropArea.width, dropArea.height);
    
};

dropArea.addEventListener('drop', handleDrop);
dropArea.addEventListener('dragover', handleDragOver);
input.addEventListener('change', handleInput);

dropArea.addEventListener('mousemove', (e) => {
    if (imageLoaded) {
        e.preventDefault();
        const file = input.files[0];
        const imageURL = URL.createObjectURL(file);
        const image = new Image();
        image.src = imageURL;
        
        image.onload = () => {
            drawImageOnCanvas(image);
            URL.revokeObjectURL(imageURL); // Free up memory
        };
    }
});
    
// Add mouseout event listener to prevent image clearing
dropArea.addEventListener('mouseout', (e) => {
    // Only prevent clearing if an image is loaded
    if (imageLoaded) {
        e.preventDefault();
    }
});

// Add mouseover event listener to restore image clearing
dropArea.addEventListener('mouseover', (e) => {
    // Only restore clearing if an image is loaded
    if (imageLoaded) {
        e.preventDefault();
        drawImageOnCanvas(input.files[0]);
    }
});
