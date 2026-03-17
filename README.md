# Netflix-Style Personal Portfolio

This is a unique, interactive personal portfolio website inspired by Netflix's "Who's Watching?" interface. This project showcases different aspects of my professional and personal life through themed profile pages with animations and a modern design.

## 🎬 Features

### Main Interface
- **Netflix-style Profile Selection**: Choose between different personas (Developer, Hiring Manager, Stalker)
- **Smooth Animations**: Loading screen with animated logo, hover effects, and transitions
- **Audio Integration**: Optional Netflix-style sound effects (place `netflix-sound.mp3` in the root folder)
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

### Profile Pages

#### Developer Profile (`developer.html`)
- Professional portfolio showcasing coding skills and projects
- Tech stack highlights and GitHub integration
- Project showcase with interactive elements

#### Hiring Manager Profile (`hiring-manager.html`)
- Professional resume and career highlights
- Skills assessment and qualifications
- Contact information and professional networking

#### Stalker Profile (`stalker.html`)
- Personal life gallery with categorized memories
- **Interactive Galleries**: Click on any memory category to explore dedicated pages:
  - **Family Time** (`family.html`) - Family gatherings and moments
  - **Adventures** (`adventures.html`) - Travel and exploration photos
  - **Celebrations** (`celebrations.html`) - Birthdays, weddings, holidays
  - **Daily Life** (`daily-life.html`) - Everyday moments and routines
  - **Special Occasions** (`special-occasions.html`) - Milestones and achievements
  - **Nature** (`nature.html`) - Outdoor and scenic photography

#### Artist Profile (`artist.html`)
- Creative portfolio showcasing my artistic work
- Design philosophy and inspiration
- Visual art gallery and creative process

## Getting Started

### Quick Start
1. **Download/Clone** the repository to your local machine
2. **Open** `index.html` in your web browser
3. **Select** a profile to explore different aspects of the portfolio

### Running Locally
```bash
# Navigate to the project directory
cd "netflixStyle Personal Portfolio"

# Open in default browser (macOS)
open index.html

# Or start a local server (optional, for better compatibility)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 Project Structure

```
netflixStyle Personal Portfolio/
├── index.html              # Main entry point with profile selection
├── developer.html          # Developer portfolio page
├── hiring-manager.html     # Professional resume page
├── stalker.html           # Personal life gallery
├── artist.html            # Creative portfolio page
├── family.html            # Family memories gallery
├── adventures.html        # Travel adventures gallery
├── celebrations.html      # Celebration moments gallery
├── daily-life.html        # Daily life moments gallery
├── special-occasions.html # Special events gallery
├── nature.html            # Nature photography gallery
├── styles.css             # Main stylesheet
├── stalker.css            # Stalker page specific styles
├── artist.css             # Artist page specific styles
├── script.js              # Interactive JavaScript functionality
├── images/                # Image assets directory
├── README.md              # This file
└── .gitignore            # Git ignore file
```

## Customization

### Personalizing Content
1. **Replace Images**: Update image URLs in HTML files to use your own photos
2. **Edit Text**: Modify the content in each HTML file to reflect your information
3. **Update Colors**: Change color schemes in the CSS files
4. **Add Audio**: Place your own `netflix-sound.mp3` file in the root directory

### Adding New Galleries
1. Create a new HTML file (e.g., `new-category.html`)
2. Follow the structure of existing gallery pages
3. Add a link to it from `stalker.html`
4. Update the CSS if needed for custom styling

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript**: Interactive functionality and smooth transitions
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Typography (if applicable)

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Acknowledgments

- Inspired by Netflix's user interface design
- Font Awesome for icons
- Built with modern web standards


*Double-click `index.html` to start exploring the different sides of the portfolio.*

