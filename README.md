# Interactive Solar System Simulation

An educational 3D solar system simulation built with [Three.js](https://threejs.org/) for school children to explore and learn about our solar system.

## Features

- **Complete Solar System**: 8 planets, 21 moons, Saturn's and Uranus's rings, asteroid belt, and thousands of stars
- **Realistic Visuals**: High-quality NASA textures from Solar System Scope (CC BY 4.0)
- **Asteroid Belt**: 1,250+ asteroids between Mars and Jupiter, including Ceres, Vesta, Pallas, and Hygiea
- **NASA Image Gallery**: Click on any planet to view real NASA images with source links
- **Tour Mode**: Automatic guided tour through all planets
- **Smooth Navigation**: Cinematic camera transitions when focusing on planets
- **Interactive Controls**: Planet focusing, speed control (0-9), orbital path toggle
- **Mobile Optimized**: Touch gestures, speed slider, swipe navigation, double-tap focus
- **Educational**: Detailed planet facts panel with real astronomical data
- **Persistent Settings**: Remembers your preferences between sessions

## Moons

- **Earth**: Moon
- **Mars**: Phobos, Deimos
- **Jupiter**: Io, Europa, Ganymede, Callisto (Galilean moons)
- **Saturn**: Titan, Rhea, Iapetus, Dione, Tethys, Enceladus, Mimas
- **Uranus**: Miranda, Ariel, Umbriel, Titania, Oberon
- **Neptune**: Triton, Nereid

## Controls

### Desktop
- **Arrow Keys/Q/A**: Navigate camera view
- **P**: Toggle orbital paths | **T**: Start/stop tour mode
- **0-9**: Speed control (0=stop, 9=full speed)
- **Planet Focus**: M(Mercury), V(Venus), E(Earth), R(Mars), J(Jupiter), S(Saturn), U(Uranus), N(Neptune)
- **ESC**: Release planet focus or stop tour
- **Mouse**: Click-drag to look around, scroll to zoom
- **Click Planet**: View NASA images in gallery

### Mobile
- **Touch-drag**: Look around | **Pinch**: Zoom in/out
- **Double-tap**: Focus on planet under finger
- **Swipe left/right**: Navigate to next/previous planet (when focused)
- **Tap planet**: View NASA images
- **Speed slider**: Control animation speed
- **Buttons**: Tour mode, orbital paths, planet selection

## How to Run

### Option 1: Direct Browser
1. Open `index.html` in any modern web browser
2. Start exploring immediately!

### Option 2: Local Server
```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .

# Then visit: http://localhost:8000
```

### Option 3: Docker Container
```bash
# Build the container
docker build -f Docker/Dockerfile -t solar-system-sim:local .

# Run the container
docker run --rm -p 8080:80 solar-system-sim:local

# Visit: http://localhost:8080
```

## Browser Requirements
- Modern browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Works on desktop, tablet, and mobile devices

## Credits

**Built with:**
- [Three.js](https://threejs.org/) - 3D WebGL library
- HTML5 Canvas for procedural textures
- [Cursor IDE](https://cursor.com/) - AI-assisted development

**Textures:**
- Planet textures from [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0)
- NASA/JPL public domain imagery

**Planet Images:**
- NASA Visible Earth, NASA/JPL Photojournal
- NASA missions: Apollo, Voyager, Cassini, Juno, MESSENGER, Magellan, New Horizons
