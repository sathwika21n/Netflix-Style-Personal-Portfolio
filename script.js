// Function to generate a simple tone (fallback if audio file not found)
function playNetflixTone() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200; // Frequency in Hz
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1.5);
    } catch (error) {
        console.log('Could not generate tone:', error);
    }
}

// Loading Screen Animation
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const whoIsWatchingSection = document.querySelector('.who-is-watching');
    const netflixSound = document.getElementById('netflix-sound');
    
    // Function to attempt playing sound
    function attemptPlaySound(audioElement) {
        if (!audioElement) return false;
        
        // Set volume
        audioElement.volume = 0.5;
        
        // Try to play the sound
        const playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Sound playing successfully');
                    return true;
                })
                .catch(error => {
                    console.log('Autoplay prevented or file not found:', error);
                    return false;
                });
        }
        return false;
    }
    
    // Check if audio file exists and can play
    let soundPlayed = false;
    
    if (netflixSound) {
        // Listen for error (file not found)
        netflixSound.addEventListener('error', (e) => {
            console.log('Audio file not found or failed to load');
            // Use fallback tone
            if (!soundPlayed) {
                setTimeout(() => {
                    playNetflixTone();
                    soundPlayed = true;
                }, 500);
            }
        });
        
        // Listen for loaded event
        netflixSound.addEventListener('canplaythrough', () => {
            // Try to play the sound
            attemptPlaySound(netflixSound);
            soundPlayed = true;
        });
        
        // Try to play immediately (may be blocked by autoplay policy)
        if (!attemptPlaySound(netflixSound)) {
            soundPlayed = false;
        }
    } else {
        // No audio element found, use tone
        setTimeout(() => {
            playNetflixTone();
            soundPlayed = true;
        }, 500);
    }
    
    // Fallback: If no sound played after a moment, use generated tone
    setTimeout(() => {
        if (!soundPlayed) {
            playNetflixTone();
        }
    }, 800);
    
    // After animation completes, fade out loading screen and show "Who's Watching"
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
        
        // Show "Who's Watching" section
        setTimeout(() => {
            if (whoIsWatchingSection) {
                whoIsWatchingSection.classList.add('show');
            }
        }, 300);
        
        // Remove loading screen from DOM after fade out
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 800);
    }, 2500); // Total animation duration
});

// Who's Watching Profile Selection
const whoIsWatchingSection = document.querySelector('.who-is-watching');
const heroSection = document.querySelector('.hero');
const profileButtons = document.querySelectorAll('.profile');

profileButtons.forEach(profile => {
    profile.addEventListener('click', function() {
        const selectedProfile = this.getAttribute('data-profile');
        
        // Navigate to the appropriate page based on selected profile
        window.location.href = `${selectedProfile}.html`;
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

menuToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.navbar-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Project cards hover effect enhancement
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(229, 9, 20, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// Hero buttons click handlers
const viewWorkBtn = document.querySelector('.hero-buttons .btn-primary');
const downloadResumeBtn = document.querySelector('.hero-buttons .btn-secondary');

if (viewWorkBtn) {
    viewWorkBtn.addEventListener('click', () => {
        document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
    });
}

if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
        // Replace with actual resume download link
        alert('Resume download functionality would go here!');
    });
}

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simulate form submission
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        alert('Thank you for your message! I\'ll get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// View Project and View Code button handlers
const viewProjectButtons = document.querySelectorAll('.btn-view');
const viewCodeButtons = document.querySelectorAll('.btn-github');

viewProjectButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Replace with actual project URLs
        const projectTitles = [
            'E-commerce Platform',
            'Task Management App',
            'Weather Dashboard',
            'Social Media App'
        ];
        alert(`Viewing ${projectTitles[index]} project!`);
    });
});

viewCodeButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Replace with actual GitHub URLs
        alert(`Opening GitHub repository for project ${index + 1}!`);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add active class to current section in navigation
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add typing effect to hero title (optional enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Uncomment to enable typing effect
    // typeWriter();
}

//console msg 
console.log('%c Welcome to my portfolio! ', 'background: #e50914; color: #fff; font-size: 20px; padding: 10px;');
console.log('%c Feel free to explore! ', 'background: #fff; color: #e50914; font-size: 14px; padding: 5px;');
