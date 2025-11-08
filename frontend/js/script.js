document.addEventListener('DOMContentLoaded', function() {

    // --- BREEDS PAGE: Fetch and display breeds ---
    const breedsGallery = document.getElementById('breeds-gallery');
    if (breedsGallery) {
        fetch('/api/breeds')
            .then(response => response.json())
            .then(breeds => {
                breedsGallery.innerHTML = ''; // Clear existing content
                breeds.forEach(breed => {
                    const breedCard = `
                        <div class="col-md-4 mb-4 breed-card">
                            <div class="card">
                                <img src="${breed.image_path}" class="card-img-top" alt="${breed.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${breed.name}</h5>
                                    <p class="card-text">${breed.description}</p>
                                    <p class="card-text fw-bold">Price: $${breed.price}</p>
                                    <a href="breed-details.html?id=${breed.id}" class="btn btn-secondary">View Details</a>
                                    <a href="contact.html" class="btn btn-primary">Buy Now</a>
                                </div>
                            </div>
                        </div>
                    `;
                    breedsGallery.innerHTML += breedCard;
                });
            })
            .catch(error => {
                console.error('Error fetching breeds:', error);
                breedsGallery.innerHTML = '<p class="text-center">Could not load breeds. Please try again later.</p>';
            });
    }

    // --- BREEDS PAGE: Search/Filter ---
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const filter = searchInput.value.toLowerCase();
            const breedCards = document.querySelectorAll('.breed-card');
            breedCards.forEach(function(card) {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                if (title.includes(filter)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- BREED DETAILS PAGE ---
    const breedDetailsContent = document.getElementById('breed-details-content');
    if (breedDetailsContent) {
        const urlParams = new URLSearchParams(window.location.search);
        const breedId = urlParams.get('id');
        if (breedId) {
            fetch(`/api/breeds/${breedId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Breed not found');
                    }
                    return response.json();
                })
                .then(breed => {
                    breedDetailsContent.innerHTML = `
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${breed.image_path}" class="img-fluid rounded shadow-sm" alt="${breed.name}">
                            </div>
                            <div class="col-md-6">
                                <h2 class="display-5">${breed.name}</h2>
                                <p class="lead">${breed.description}</p>
                                <hr class="my-4">
                                <h4>Price</h4>
                                <p class="fw-bold fs-4">$${breed.price}</p>
                                <a href="contact.html" class="btn btn-primary btn-lg mt-3">Buy Now</a>
                                <a href="breeds.html" class="btn btn-secondary btn-lg mt-3">Back to Breeds</a>
                            </div>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Error fetching breed details:', error);
                    breedDetailsContent.innerHTML = '<p class="text-center">Could not load breed details. Please try again later.</p>';
                });
        }
    }

    // --- UPLOAD PAGE: Login Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            // ... (login logic remains the same)
        });
    }

    // --- UPLOAD PAGE: Upload Form Logic ---
    const uploadForm = document.querySelector('#upload-section form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData();
            formData.append('name', document.getElementById('breedName').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('price', document.getElementById('price').value);
            formData.append('image', document.getElementById('dogImage').files[0]);

            try {
                const response = await fetch('/api/breeds', {
                    method: 'POST',
                    body: formData,
                    // No 'Content-Type' header needed, browser sets it for FormData
                });

                if (response.ok) {
                    alert('Breed uploaded successfully!');
                    window.location.href = 'breeds.html'; // Redirect to breeds page
                } else {
                    const errorData = await response.json();
                    alert('Upload failed: ' + errorData.message);
                }
            } catch (error) {
                console.error('Upload request failed:', error);
                alert('An error occurred during upload. Please try again.');
            }
        });
    }
});