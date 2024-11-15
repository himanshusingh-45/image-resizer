import React, { useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'; // Include your CSS here

const ImageResizerApp = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [resizeWidth, setResizeWidth] = useState(0);
    const [resizeHeight, setResizeHeight] = useState(0);
    const [imageQuality, setImageQuality] = useState(80);
    const [imageFormat, setImageFormat] = useState("jpeg");
    const [originalImage, setOriginalImage] = useState(null);
    const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
    const [resizeUnit, setResizeUnit] = useState("pixels");
    const [filter, setFilter] = useState("none");
    const previewRef = useRef(null);
    
    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target.result;
                setImagePreview(imageUrl);
                const img = new Image();
                img.src = imageUrl;
                img.onload = () => {
                    setResizeWidth(img.width);
                    setResizeHeight(img.height);
                    setOriginalImage(img);
                };
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleWidthChange = (e) => {
        const width = e.target.value;
        setResizeWidth(width);
        if (aspectRatioLocked && originalImage) {
            setResizeHeight(Math.round((originalImage.height / originalImage.width) * width));
        }
    };

    const handleHeightChange = (e) => {
        const height = e.target.value;
        setResizeHeight(height);
        if (aspectRatioLocked && originalImage) {
            setResizeWidth(Math.round((originalImage.width / originalImage.height) * height));
        }
    };

    const handleQualityChange = (e) => {
        setImageQuality(e.target.value);
    };

    const handleResizeUnitChange = (e) => {
        setResizeUnit(e.target.value);
    };

    const handleFormatChange = (e) => {
        setImageFormat(e.target.value);
    };

    const handleAspectRatioToggle = () => {
        setAspectRatioLocked(!aspectRatioLocked);
    };

    const resetForm = () => {
        setImageFile(null);
        setImagePreview(null);
        setResizeWidth(0);
        setResizeHeight(0);
        setImageQuality(80);
        setImageFormat("jpeg");
        setOriginalImage(null);
        setAspectRatioLocked(true);
        setResizeUnit("pixels");
        setFilter("none");
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const downloadImage = () => {
        if (!imagePreview) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to 500x500
        const newWidth = 500;
        const newHeight = 500;
        canvas.width = newWidth;
        canvas.height = newHeight;

        const img = new Image();
        img.src = imagePreview;

        img.onload = () => {
            // Draw the resized image on the canvas
            ctx.filter = filter; // Apply filter
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert canvas to data URL
            const dataURL = canvas.toDataURL(`image/${imageFormat}`, imageQuality / 100);

            // Create a temporary link to trigger download
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `resized-image.${imageFormat}`; // Set the default file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up the link element
        };
    };

     return (
        <div className={`d-flex justify-content-center align-items-center min-vh-100 ${darkMode ? 'dark-mode' : ''}`}>
            <div className="container p-5 shadow-lg" style={{ maxWidth: "900px", backgroundColor: "#fff", borderRadius: "15px" }}>
                <div className="text-end mb-3">
                    <button className="btn btn-outline-dark" onClick={handleDarkModeToggle}>
                        {darkMode ? <i className="bi bi-brightness-high"></i> : <i className="bi bi-moon-stars"></i>}
                        {darkMode ? " Light Mode" : " Dark Mode"}
                    </button>
                </div>
                
                <h1 className="title text-center mb-4">Image Resizer</h1>

                <div className="card border-light mb-4">
                    <div className="card-body">
                        <div className="text-center mb-3">
                            <label htmlFor="imageInput" className="upload-label btn btn-outline-primary">
                                <i className="bi bi-cloud-upload"></i> Upload Image
                            </label>
                            <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>

                        {imagePreview && (
                            <div id="action-form">
                                <div className="mb-4 text-center">
                                    <h2 className="h5">Preview:</h2>
                                    <img ref={previewRef} id="preview" src={imagePreview} alt="Preview" className="img-fluid rounded border" style={{ filter }} />
                                    <p id="image-dimensions" className="mt-2">Original Dimensions: {resizeWidth}px x {resizeHeight}px</p>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="resizeUnit" className="form-label fw-bold">Unit:</label>
                                        <select id="resizeUnit" className="form-select" value={resizeUnit} onChange={handleResizeUnitChange}>
                                            <option value="pixels">Pixels</option>
                                            <option value="percentage">Percentage</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="resizeWidth" className="form-label fw-bold">Width:</label>
                                        <input type="number" id="resizeWidth" className="form-control" value={resizeWidth} onChange={handleWidthChange} />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="resizeHeight" className="form-label fw-bold">Height:</label>
                                        <input type="number" id="resizeHeight" className="form-control" value={resizeHeight} onChange={handleHeightChange} />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="imageFormat" className="form-label fw-bold">Format:</label>
                                        <select id="imageFormat" className="form-select" value={imageFormat} onChange={handleFormatChange}>
                                            <option value="jpeg">JPEG</option>
                                            <option value="png">PNG</option>
                                            <option value="webp">WebP</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="quality" className="form-label fw-bold">Quality:</label>
                                        <input type="range" id="quality" className="form-range" min="1" max="100" value={imageQuality} onChange={handleQualityChange} />
                                        <span id="quality-value" className="quality-value">{imageQuality}</span>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Filter:</label>
                                        <select className="form-select" value={filter} onChange={handleFilterChange}>
                                            <option value="none">None</option>
                                            <option value="grayscale(100%)">Grayscale</option>
                                            <option value="sepia(100%)">Sepia</option>
                                        </select>
                                    </div>

                                    <div className="col-12 text-center mt-4">
                                        <button className="btn btn-primary me-2" onClick={downloadImage}>
                                            <i className="bi bi-download"></i> Download
                                        </button>
                                        <button className="btn btn-secondary" onClick={resetForm}>
                                            <i className="bi bi-arrow-repeat"></i> Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            
                        )}
                          <div className="container my-5">
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <i className="fas fa-image fa-3x"></i>
          <h5 className="mt-3">Perfect Quality</h5>
          <p>The best online image resizer to resize your images at the highest quality.</p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="fas fa-bolt fa-3x"></i>
          <h5 className="mt-3">Lightning Fast</h5>
          <p>This cloud-hosted, highly scalable tool can resize your images within seconds!</p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="fas fa-crop-alt fa-3x"></i>
          <h5 className="mt-3">Easy To Use</h5>
          <p>Simply upload your image and enter a target size. It's as easy as that!</p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="fas fa-globe fa-3x"></i>
          <h5 className="mt-3">Works Anywhere</h5>
          <p>It works on any platform (Windows, Linux, Mac). No software to install!</p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="fas fa-shield-alt fa-3x"></i>
          <h5 className="mt-3">Privacy Guaranteed</h5>
          <p>Your images are processed securely and deleted automatically after use.</p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="fas fa-heart fa-3x"></i>
          <h5 className="mt-3">It’s Free</h5>
          <p>We offer image resizing for free with no registrations, watermarks, or limits.</p>
        </div>
      </div>
    </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};
 
export default ImageResizerApp;
