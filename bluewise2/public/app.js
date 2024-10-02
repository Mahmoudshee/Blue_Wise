
const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const ImageView = document.getElementById("img-view");


function uploadImage(file) {
    let imgLink = URL.createObjectURL(file);
    ImageView.style.backgroundImage = `url(${imgLink})`;
    ImageView.textContent = '';
    ImageView.style.border = 'none';
}


inputFile.addEventListener("change", function() {
    uploadImage(inputFile.files[0]);
});


dropArea.addEventListener("dragover", function(e) {
    e.preventDefault();
    dropArea.style.border = '2px dashed #000'; 
});

dropArea.addEventListener("dragleave", function(e) {
    e.preventDefault();
    dropArea.style.border = ''; 
});

dropArea.addEventListener("drop", function(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        uploadImage(files[0]);
    }
    dropArea.style.border = ''; 
});

dropArea.addEventListener("click", function() {
    inputFile.click();
});

const dropAreaVideo = document.getElementById("drop-area-video");
const inputVideo = document.getElementById("input-video");
const ImageViewVideo = document.getElementById("img-view-video");

inputVideo.addEventListener("change", uploadVideo);
function uploadVideo() {
    let videoLink = URL.createObjectURL(inputVideo.files[0]);
    ImageViewVideo.innerHTML = `<video width="100%" controls>
                                   <source src="${videoLink}" type="video/mp4">
                                   Your browser does not support the video tag.
                                </video>`;

    ImageViewVideo.style.border = 'none';
                                
}

dropAreaVideo.addEventListener("dragover", function (e) {
    e.preventDefault();
});

dropAreaVideo.addEventListener("drop", function (e) {
    e.preventDefault();
    inputVideo.files = e.dataTransfer.files;
    const event = new Event('change', { bubbles: true });
    inputVideo.dispatchEvent(event);
});