// Global variables
let currentPhotoIndex = 0;
let photos = [];

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        const data = await response.json();
        photos = data.photos;
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback photos if JSON fails to load
        photos = [
            {
                src: "images/1.jpg",
                caption: "My heart melts watching you cut your birthday cake while I clap like the happiest husband in the world 🎂👏❤️"
            },
            {
                src: "images/2.jpg", 
                caption: "The same magical moment captured from another angle - your smile lighting up the entire room, meri jaan 😍✨"
            },
            {
                src: "images/3.jpg",
                caption: "You lovingly feeding me cake with your gentle hands - this sweetness will forever be in my heart 🍰💕"
            },
            {
                src: "images/4.jpg",
                caption: "My turn to feed you while we both burst into laughter - these giggles are the soundtrack of our love 😄🎂💖"
            },
            {
                src: "images/5.jpg",
                caption: "After all the cake fun, holding you close and kissing your forehead - my favorite place in the world 💕😘🤗"
            }
        ];
    }
}

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    initializeFloatingHearts();
    initializeKeyboardNavigation();
    initializeTouchNavigation();
    
    // Preload images for better performance
    setTimeout(preloadImages, 1000);
});

// Open Letter Function
function openLetter() {
    const envelope = document.getElementById('envelope');
    const letterModal = document.getElementById('letterModal');
    const instructions = document.getElementById('instructions');
    
    // Add opened class to envelope
    envelope.classList.add('opened');
    
    // Hide instructions
    instructions.style.display = 'none';
    
    // Show letter modal after envelope animation
    setTimeout(() => {
        letterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 800);
}

// Close Letter Function
function closeLetter() {
    const envelope = document.getElementById('envelope');
    const letterModal = document.getElementById('letterModal');
    const instructions = document.getElementById('instructions');
    
    // Hide letter modal
    letterModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset envelope after modal closes
    setTimeout(() => {
        envelope.classList.remove('opened');
        instructions.style.display = 'block';
    }, 500);
}

// Photo gallery functions
function openGallery() {
    const gallery = document.getElementById('photoGallery');
    gallery.style.display = 'block';
    
    // Prevent body scroll when gallery is open
    document.body.style.overflow = 'hidden';
    
    // Show first photo
    showPhoto(0);
}

function closeGallery() {
    const gallery = document.getElementById('photoGallery');
    gallery.style.display = 'none';
    
    // Restore body scroll (but keep letter modal scroll disabled)
    // We don't restore scroll here because letter modal should remain open
}

function showPhoto(index) {
    if (photos.length === 0) return;
    
    const photo = photos[index];
    const photoImg = document.getElementById('currentPhoto');
    const photoCaption = document.getElementById('photoCaption');
    const photoCounter = document.getElementById('photoCounter');
    
    // Update photo with fade effect
    photoImg.style.opacity = '0';
    
    setTimeout(() => {
        photoImg.src = photo.src;
        photoImg.alt = photo.caption;
        photoCaption.textContent = photo.caption;
        photoCounter.textContent = `${index + 1} / ${photos.length}`;
        currentPhotoIndex = index;
        
        photoImg.style.opacity = '1';
    }, 200);
}

function nextPhoto() {
    const nextIndex = (currentPhotoIndex + 1) % photos.length;
    showPhoto(nextIndex);
}

function previousPhoto() {
    const prevIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    showPhoto(prevIndex);
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        const gallery = document.getElementById('photoGallery');
        const letterModal = document.getElementById('letterModal');
        
        // Gallery navigation
        if (gallery.style.display === 'block') {
            switch(event.key) {
                case 'ArrowRight':
                case ' ':
                    event.preventDefault();
                    nextPhoto();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    previousPhoto();
                    break;
                case 'Escape':
                    event.preventDefault();
                    closeGallery();
                    break;
            }
        }
        // Letter modal navigation
        else if (letterModal.classList.contains('active')) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeLetter();
            }
        }
    });
}

// Touch/swipe navigation for mobile
function initializeTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const gallery = document.getElementById('photoGallery');
    
    gallery.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    
    gallery.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next photo
                nextPhoto();
            } else {
                // Swipe right - previous photo
                previousPhoto();
            }
        }
    }
}

// Floating hearts animation
function initializeFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        // Random heart emoji
        const heartEmojis = ['❤️', '💕', '💖', '💝', '💗', '💓', '🌹'];
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        // Random position and timing
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 4 + 's';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 6000);
    }
    
    // Create hearts periodically
    setInterval(createFloatingHeart, 2000);
    
    // Create initial hearts
    for (let i = 0; i < 3; i++) {
        setTimeout(createFloatingHeart, i * 500);
    }
}

// Preload images for better performance
function preloadImages() {
    photos.forEach(photo => {
        const img = new Image();
        img.src = photo.src;
    });
}

// Error handling for missing images
function handleImageError(img) {
    const caption = document.getElementById('photoCaption');
    caption.textContent = 'Image not found. Please check the images folder.';
    caption.style.color = '#e74c3c';
}

// Add image error handling
document.addEventListener('DOMContentLoaded', function() {
    const photoImg = document.getElementById('currentPhoto');
    photoImg.addEventListener('error', function() {
        handleImageError(this);
    });
});

// Mobile performance optimizations
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Reduce animations on mobile for better performance
if (isMobileDevice()) {
    document.addEventListener('DOMContentLoaded', function() {
        const style = document.createElement('style');
        style.textContent = `
            .floating-heart {
                animation-duration: 3s !important;
            }
            
            .main-title {
                animation-duration: 4s !important;
            }
            
            .envelope:hover {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    });
}

// Smooth scroll behavior for letter modal content
document.addEventListener('DOMContentLoaded', function() {
    const letterModal = document.getElementById('letterModal');
    
    letterModal.addEventListener('scroll', function() {
        // Add any scroll-based animations here if needed
    });
});

// Add smooth entrance animations
function addEntranceAnimations() {
    const animatedElements = document.querySelectorAll('.header, .envelope-container, .instructions');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize entrance animations after page load
window.addEventListener('load', addEntranceAnimations);