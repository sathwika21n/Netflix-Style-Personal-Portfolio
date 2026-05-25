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

if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.navbar-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarMenu) {
            navbarMenu.classList.remove('active');
        }
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

if (viewWorkBtn) {
    viewWorkBtn.addEventListener('click', () => {
        document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
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
        //alert(`Opening GitHub repository for project ${index + 1}!`);
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

// Portfolio AI Assistant
const portfolioAssistantData = [
    {
        topic: 'profile',
        keywords: ['who', 'sathwika', 'about', 'profile', 'summary', 'intro', 'introduction'],
        answer: 'Sathwika Thatiparthi is a Computer Science student at the University of Texas at Dallas. Her portfolio focuses on full-stack development, software engineering, web development, system design, creative work, and personal projects.'
    },
    {
        topic: 'education',
        keywords: ['education', 'school', 'college', 'university', 'utd', 'ut dallas', 'degree', 'student'],
        answer: 'Sathwika is currently pursuing Computer Science at the University of Texas at Dallas.'
    },
    {
        topic: 'experience',
        keywords: ['experience', 'work', 'background', 'hire', 'professional', 'internship', 'job', 'career'],
        answer: 'Sathwika has hands-on project experience in full-stack development and software engineering. Her portfolio highlights projects that show technical proficiency, problem-solving ability, clean code habits, and readiness to contribute to software development teams.'
    },
    {
        topic: 'skills',
        keywords: ['skills', 'technologies', 'tech stack', 'languages', 'frameworks', 'tools', 'programming'],
        answer: 'Her listed skills include HTML5, CSS3, JavaScript, React, Node.js, and Python. The portfolio also mentions full-stack development, modern web technologies, software engineering, and system design.'
    },
    {
        topic: 'projects',
        keywords: ['projects', 'portfolio', 'built', 'created', 'github', 'code', 'apps', 'application'],
        answer: 'Featured projects include Advisor AI, an AI-powered academic advisor built with Python3 and Streamlit; an Alumni Tracking System using Vue.js, TypeScript, and Jupyter Notebook; and EndoTrack, a React, TypeScript, and Python project focused on endometriosis support with personalized recommendations and local hospital suggestions.'
    },
    {
        topic: 'advisor ai',
        keywords: ['advisor', 'academic', 'course', 'degree path', 'streamlit'],
        answer: 'Advisor AI is an AI-powered academic advisor application that helps students navigate course selections and degree paths. The portfolio lists Python3 and Streamlit as its technologies.'
    },
    {
        topic: 'alumni tracking system',
        keywords: ['alumni', 'tracking', 'naf', 'vue', 'typescript', 'jupyter'],
        answer: 'The Alumni Tracking System is described as a system for tracking and managing alumni information and engagement. Its listed technologies include Vue.js, TypeScript, and Jupyter Notebook.'
    },
    {
        topic: 'endotrack',
        keywords: ['endotrack', 'endometriosis', 'hospital', 'recommendations', 'wehack'],
        answer: 'EndoTrack focuses on endometriosis. Patients can enter their information and receive personalized recommendations plus local hospital suggestions. The portfolio lists Python, TypeScript, and React for this project.'
    },
    {
        topic: 'contact',
        keywords: ['contact', 'email', 'linkedin', 'github', 'reach', 'social', 'connect'],
        answer: 'You can connect with Sathwika through the contact section of the site. The developer page links to her GitHub at github.com/sathwika21n and LinkedIn at linkedin.com/in/sathwika-thatiparthi-221019230.'
    },
    {
        topic: 'resume',
        keywords: ['resume', 'cv', 'download'],
        answer: 'The developer page includes a Download Resume button for Sathwika_Thatiparthi_Resume.pdf.'
    },
    {
        topic: 'site',
        keywords: ['website', 'portfolio', 'netflix', 'profiles', 'artist', 'personal', 'hiring manager'],
        answer: 'This is a Netflix-style personal portfolio with profile pages for Developer, Hiring Manager, Personal Life, and Artist views. It uses HTML, CSS, JavaScript, Font Awesome icons, animations, and responsive design.'
    }
];

function initializePortfolioAssistant() {
    if (document.querySelector('.chatbot-widget')) return;

    const pageText = Array.from(document.querySelectorAll('h1, h2, h3, p, .project-tags span'))
        .map(element => element.textContent.trim())
        .filter(Boolean)
        .join(' ');

    const chatbot = document.createElement('aside');
    chatbot.className = 'chatbot-widget';
    chatbot.setAttribute('aria-label', 'Portfolio AI assistant');
    chatbot.innerHTML = `
        <button class="chatbot-toggle" type="button" aria-label="Open portfolio assistant">
            <i class="fas fa-robot"></i>
        </button>
        <div class="chatbot-panel" aria-hidden="true">
            <div class="chatbot-header">
                <div>
                    <p class="chatbot-eyebrow">Portfolio AI</p>
                    <h2>Ask about Sathwika</h2>
                </div>
                <button class="chatbot-close" type="button" aria-label="Close assistant">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chatbot-messages" aria-live="polite">
                <div class="chat-message bot-message">
                    Hi! Ask me about Sathwika's experience, projects, skills, education, resume, or contact info.
                </div>
            </div>
            <div class="chatbot-suggestions" aria-label="Suggested questions">
                <button type="button">What is Sathwika's experience?</button>
                <button type="button">What projects has she built?</button>
                <button type="button">What are her skills?</button>
            </div>
            <form class="chatbot-form">
                <input type="text" placeholder="Ask a question..." aria-label="Ask a question about the portfolio" autocomplete="off">
                <button type="submit" aria-label="Send question">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(chatbot);

    const toggle = chatbot.querySelector('.chatbot-toggle');
    const close = chatbot.querySelector('.chatbot-close');
    const panel = chatbot.querySelector('.chatbot-panel');
    const messages = chatbot.querySelector('.chatbot-messages');
    const form = chatbot.querySelector('.chatbot-form');
    const input = chatbot.querySelector('.chatbot-form input');
    const suggestionButtons = chatbot.querySelectorAll('.chatbot-suggestions button');

    const setOpen = (isOpen) => {
        chatbot.classList.toggle('open', isOpen);
        panel.setAttribute('aria-hidden', String(!isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close portfolio assistant' : 'Open portfolio assistant');
        if (isOpen) input.focus();
    };

    const addMessage = (message, type, extraClass = '') => {
        const bubble = document.createElement('div');
        bubble.className = `chat-message ${type}-message ${extraClass}`.trim();
        bubble.textContent = message;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
        return bubble;
    };

    const answerFromPortfolioData = (question) => {
        const normalizedQuestion = question.toLowerCase();

        const rankedTopics = portfolioAssistantData
            .map(item => {
                const score = item.keywords.reduce((total, keyword) => {
                    return normalizedQuestion.includes(keyword) ? total + keyword.length : total;
                }, 0);
                return { ...item, score };
            })
            .sort((first, second) => second.score - first.score);

        if (rankedTopics[0].score > 0) {
            return rankedTopics[0].answer;
        }

        const matchingPageSentence = (pageText.match(/[^.!?]+[.!?]*/g) || [])
            .find(sentence => {
                const importantWords = normalizedQuestion
                    .split(/\W+/)
                    .filter(word => word.length > 4);
                return importantWords.some(word => sentence.toLowerCase().includes(word));
            });

        if (matchingPageSentence) {
            return `From this page: ${matchingPageSentence}`;
        }

        return 'I can answer based on the portfolio content I have here. Try asking about Sathwika\'s experience, education, skills, projects, resume, GitHub, LinkedIn, or contact info.';
    };

    const answerQuestion = async (question) => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });

            const payload = await response.json();
            if (!response.ok) {
                return `${answerFromPortfolioData(question)}\n\nAI service message: ${payload.error || 'The AI assistant is unavailable right now.'}`;
            }

            return payload.answer || answerFromPortfolioData(question);
        } catch (error) {
            return `${answerFromPortfolioData(question)}\n\nReal AI mode is not connected right now. Start the Node server with your OpenAI API key to enable live AI answers.`;
        }
    };

    const handleQuestion = (question) => {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion) return;

        addMessage(trimmedQuestion, 'user');
        input.value = '';
        input.disabled = true;
        form.querySelector('button').disabled = true;

        window.setTimeout(async () => {
            const thinkingMessage = addMessage('Thinking...', 'bot', 'thinking-message');
            const answer = await answerQuestion(trimmedQuestion);
            thinkingMessage.textContent = answer;
            thinkingMessage.classList.remove('thinking-message');
            input.disabled = false;
            form.querySelector('button').disabled = false;
            input.focus();
            messages.scrollTop = messages.scrollHeight;
        }, 250);
    };

    toggle.addEventListener('click', () => setOpen(!chatbot.classList.contains('open')));
    close.addEventListener('click', () => setOpen(false));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleQuestion(input.value);
    });

    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => handleQuestion(button.textContent));
    });
}

document.addEventListener('DOMContentLoaded', initializePortfolioAssistant);
