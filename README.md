# Interactive Solar System Simulation

An educational 3D solar system simulation built with [Three.js](https://threejs.org/) for school children to explore and learn about our solar system.

## Features

- **Complete Solar System**: 8 planets, 6 major moons, Saturn's rings, and thousands of stars in the background
- **Realistic Visuals**: Procedural textures, proper lighting, and authentic materials
- **Interactive Controls**: Planet focusing, speed control (0-9), orbital path toggle
- **Mobile Support**: Touch controls for tablets and smartphones
- **Educational**: Ultra-slow speeds perfect for classroom observation
- **Persistent Settings**: Remembers your preferences between sessions

## Controls

- **Arrow Keys/Q/A**: Navigate camera view
- **P**: Toggle orbital paths | **0-9**: Speed control (0=stop, 9=full speed)
- **Planet Focus**: M(Mercury), V(Venus), E(Earth), R(Mars), J(Jupiter), S(Saturn), U(Uranus), N(Neptune)
- **ESC**: Release planet focus
- **Mouse**: Click-drag to look around, scroll to zoom
- **Mobile**: Touch-drag to navigate, pinch to zoom

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
Built with Three.js, WebGL, and HTML5 Canvas.

I also used [Cursor IDE](https://cursor.com/) (The AI Code Editor) to generate most of the code here as part of an experimental project.
