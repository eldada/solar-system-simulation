// Solar System Simulation
class SolarSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.sun = null;
        this.planets = [];
        this.moons = [];
        this.saturnRings = null;
        this.orbitPaths = [];
        this.animationId = null;
        this.textureLoader = null;
        
        // Animation control
        this.speedMultiplier = 1.0; // 0.0 to 1.0, where 1.0 is full speed
        this.showOrbits = false;
        
        // Planet focusing
        this.focusedPlanet = null;
        this.cameraFollowDistance = 8;
        
        // Mobile touch controls
        this.isMobile = this.detectMobile();
        this.touchState = {
            isMoving: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            pinchDistance: 0,
            isPinching: false
        };
        
        // Load saved settings
        this.loadSettings();
        
        // Movement keys state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
        
        this.init();
        this.setupEventListeners();
        this.setupMobileControls();
        this.setupMobileButtons();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            10000
        );
        this.camera.position.set(0, 80, 200);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        
        // Initialize texture loader
        this.textureLoader = new THREE.TextureLoader();
        
        // Add renderer to DOM
        const container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        
        // Add orbit controls (for mouse interaction)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.maxDistance = 2000;
        this.controls.minDistance = 10;
        
        // Create basic scene
        this.createStarField();
        this.createSun();
        this.createPlanets();
        this.createSaturnRings();
        this.createMoons();
        
        // Apply loaded settings after everything is created
        this.applyLoadedSettings();
        
        // Hide loading indicator
        document.body.classList.add('scene-ready');
        
        console.log('Solar System initialized!');
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        
        // Create varied stars with different colors and sizes
        for (let i = 0; i < starCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 3000;
            
            // Star colors (varying from blue-white to yellow-white to red)
            const starTemp = Math.random();
            if (starTemp < 0.3) {
                // Blue-white stars
                colors[i * 3] = 0.8 + Math.random() * 0.2;
                colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
                colors[i * 3 + 2] = 1.0;
            } else if (starTemp < 0.7) {
                // Yellow-white stars (like our sun)
                colors[i * 3] = 1.0;
                colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
                colors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
            } else {
                // Red-orange stars
                colors[i * 3] = 1.0;
                colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
                colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
            }
            
            // Star sizes (most small, few large)
            sizes[i] = Math.random() < 0.9 ? 0.5 + Math.random() * 1.0 : 1.5 + Math.random() * 2.0;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 1.0,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: false
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createSun() {
        // Sun geometry and enhanced material
        const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
        
        // Create a procedural sun texture
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            emissive: 0xff6600,
            emissiveIntensity: 0.8
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
        
        // Enhanced lighting setup
        const sunLight = new THREE.PointLight(0xfff8dc, 4, 800);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.1;
        sunLight.shadow.camera.far = 500;
        this.scene.add(sunLight);
        
        // Warm ambient light
        const ambientLight = new THREE.AmbientLight(0x2a2a4a, 0.15);
        this.scene.add(ambientLight);
        
        // Additional directional light for better planet illumination
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 0);
        this.scene.add(directionalLight);
    }
    
    createPlanets() {
        // Planet data: [name, radius, baseColor, distance, orbital_speed, rotation_speed] - speeds reduced by 76% total
        const planetData = [
            ['Mercury', 0.4, 0x8c6239, 15, 0.0098, 0.0049],
            ['Venus', 0.95, 0xffc649, 20, 0.00858, 0.001225],
            ['Earth', 1.0, 0x6b93d6, 30, 0.00735, 0.00245],
            ['Mars', 0.53, 0xcd5c5c, 40, 0.006125, 0.00245],
            ['Jupiter', 3.0, 0xd8ca9d, 70, 0.003675, 0.006125],
            ['Saturn', 2.5, 0xfad5a5, 100, 0.00294, 0.0056],
            ['Uranus', 1.6, 0x4fd0e7, 130, 0.00196, 0.003675],
            ['Neptune', 1.55, 0x4b70dd, 160, 0.00147, 0.00343]
        ];
        
        planetData.forEach((data, index) => {
            const [name, radius, baseColor, distance, orbitalSpeed, rotationSpeed] = data;
            
            // Create planet with enhanced geometry
            const geometry = new THREE.SphereGeometry(radius, 64, 64);
            const material = this.createPlanetMaterial(name, baseColor);
            
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(distance, 0, 0);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.userData = { name: name };
            
            this.scene.add(planet);
            
            // Create orbital path
            const orbitPath = this.createOrbitPath(distance);
            this.scene.add(orbitPath);
            this.orbitPaths.push(orbitPath);
            
            // Add to planets array
            this.planets.push({
                mesh: planet,
                name: name,
                distance: distance,
                speed: orbitalSpeed,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: rotationSpeed
            });
        });
        
        console.log(`Created ${planetData.length} planets with enhanced materials`);
    }
    
    createSaturnRings() {
        // Find Saturn
        const saturn = this.planets.find(p => p.name === 'Saturn');
        if (!saturn) return;
        
        // Create ring geometry
        const ringGeometry = new THREE.RingGeometry(3.2, 5.5, 64, 8); // inner radius, outer radius, segments
        
        // Create ring material with transparency
        const ringMaterial = new THREE.MeshLambertMaterial({
            color: 0xddddaa,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        
        // Create the rings mesh
        this.saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
        this.saturnRings.rotation.x = Math.PI / 2; // Rotate to be horizontal
        this.saturnRings.rotation.z = Math.PI / 6; // Tilt by 30 degrees
        this.saturnRings.position.copy(saturn.mesh.position);
        
        // Store original tilt values to maintain them during animation
        this.saturnRingsOriginalTiltX = Math.PI / 2;
        this.saturnRingsOriginalTiltZ = Math.PI / 6;
        
        // Add rings to scene
        this.scene.add(this.saturnRings);
        
        console.log('Saturn rings created');
    }
    
    createPlanetMaterial(planetName, baseColor) {
        // Create enhanced materials with procedural textures for each planet
        switch(planetName.toLowerCase()) {
            case 'mercury':
                // Create canvas texture for Mercury (cratered surface)
                const mercuryCanvas = this.createMercuryTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(mercuryCanvas),
                    bumpMap: new THREE.CanvasTexture(mercuryCanvas),
                    color: 0x8c6239,
                    shininess: 10,
                    bumpScale: 0.3
                });
                
            case 'venus':
                const venusCanvas = this.createVenusTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(venusCanvas),
                    color: 0xffc649,
                    emissive: 0x332200,
                    emissiveIntensity: 0.1,
                    shininess: 100
                });
                
            case 'earth':
                const earthCanvas = this.createEarthTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(earthCanvas),
                    color: 0x6b93d6,
                    specular: 0x222222,
                    shininess: 100
                });
                
            case 'mars':
                const marsCanvas = this.createMarsTexture();
                return new THREE.MeshLambertMaterial({
                    map: new THREE.CanvasTexture(marsCanvas),
                    color: 0xcd5c5c,
                    emissive: 0x110000,
                    emissiveIntensity: 0.05
                });
                
            case 'jupiter':
                const jupiterCanvas = this.createJupiterTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(jupiterCanvas),
                    color: 0xd8ca9d,
                    specular: 0x111111,
                    shininess: 30
                });
                
            case 'saturn':
                const saturnCanvas = this.createSaturnTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(saturnCanvas),
                    color: 0xfad5a5,
                    specular: 0x111111,
                    shininess: 40
                });
                
            case 'uranus':
                const uranusCanvas = this.createUranusTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(uranusCanvas),
                    color: 0x4fd0e7,
                    specular: 0x003344,
                    shininess: 120,
                    transparent: true,
                    opacity: 0.95
                });
                
            case 'neptune':
                const neptuneCanvas = this.createNeptuneTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(neptuneCanvas),
                    color: 0x4b70dd,
                    specular: 0x001144,
                    shininess: 150,
                    transparent: true,
                    opacity: 0.95
                });
                
            default:
                return new THREE.MeshLambertMaterial({ color: baseColor });
        }
    }
    
    // Procedural texture creation methods
    createMercuryTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base gray surface
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add craters
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 20 + 5;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#4a2a15');
            gradient.addColorStop(1, '#6b4423');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas;
    }
    
    createVenusTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base yellow surface with clouds
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ffcc33');
        gradient.addColorStop(0.5, '#ffaa22');
        gradient.addColorStop(1, '#ff8811');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add swirling cloud patterns
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            ctx.strokeStyle = '#ffdd44';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 20 + Math.random() * 30, 0, Math.PI * 1.5);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    createEarthTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base blue (oceans)
        ctx.fillStyle = '#4472aa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add continents (green/brown patches)
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const width = Math.random() * 80 + 40;
            const height = Math.random() * 60 + 30;
            
            ctx.fillStyle = Math.random() > 0.5 ? '#228833' : '#886644';
            ctx.fillRect(x, y, width, height);
        }
        
        // Add white clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 15 + 10;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas;
    }
    
    createMarsTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base red surface
        ctx.fillStyle = '#cc4444';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add darker red patches
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 40 + 20;
            
            ctx.fillStyle = '#aa2222';
            ctx.fillRect(x, y, size, size * 0.6);
        }
        
        // Add polar ice caps (white patches at top/bottom)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, 20);
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        
        return canvas;
    }
    
    createJupiterTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create horizontal bands
        for (let y = 0; y < canvas.height; y += 20) {
            const bandColor = y % 40 === 0 ? '#ddaa77' : '#cc9966';
            ctx.fillStyle = bandColor;
            ctx.fillRect(0, y, canvas.width, 20);
        }
        
        // Add Great Red Spot
        const gradient = ctx.createRadialGradient(canvas.width * 0.7, canvas.height * 0.6, 0, canvas.width * 0.7, canvas.height * 0.6, 40);
        gradient.addColorStop(0, '#ff4444');
        gradient.addColorStop(1, '#cc3333');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(canvas.width * 0.7, canvas.height * 0.6, 40, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }
    
    createSaturnTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create subtle horizontal bands
        for (let y = 0; y < canvas.height; y += 15) {
            const bandColor = y % 30 === 0 ? '#ffdd99' : '#eecc88';
            ctx.fillStyle = bandColor;
            ctx.fillRect(0, y, canvas.width, 15);
        }
        
        // Add subtle swirls
        for (let i = 0; i < 5; i++) {
            const y = Math.random() * canvas.height;
            ctx.strokeStyle = '#ffee99';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.quadraticCurveTo(canvas.width / 2, y + 10 * Math.sin(i), canvas.width, y);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    createUranusTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base blue-green
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#66dddd');
        gradient.addColorStop(0.5, '#44cccc');
        gradient.addColorStop(1, '#33bbbb');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle atmospheric bands
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.fillRect(0, y, canvas.width, 5);
        }
        
        return canvas;
    }
    
    createNeptuneTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base deep blue
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#3366dd');
        gradient.addColorStop(0.5, '#2255cc');
        gradient.addColorStop(1, '#1144bb');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add atmospheric storms
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 20 + 10;
            
            const stormGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            stormGradient.addColorStop(0, 'rgba(100, 150, 255, 0.3)');
            stormGradient.addColorStop(1, 'rgba(50, 100, 200, 0.1)');
            
            ctx.fillStyle = stormGradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas;
    }
    
    createMoons() {
        // Moon data: [name, parentPlanet, radius, color, distance, orbital_speed, rotation_speed] - speeds reduced by 30%
        const moonData = [
            // Earth's Moon
            ['Moon', 'Earth', 0.27, 0xcccccc, 4, 0.035, 0.035],
            
            // Jupiter's major moons (Galilean moons)
            ['Io', 'Jupiter', 0.18, 0xffff99, 6, 0.056, 0.056],
            ['Europa', 'Jupiter', 0.16, 0xaaccff, 8, 0.042, 0.042],
            ['Ganymede', 'Jupiter', 0.26, 0x887744, 10, 0.035, 0.035],
            ['Callisto', 'Jupiter', 0.24, 0x444444, 13, 0.028, 0.028],
            
            // Saturn's major moon
            ['Titan', 'Saturn', 0.26, 0xddaa77, 8, 0.042, 0.042]
        ];
        
        moonData.forEach((data, index) => {
            const [name, parentPlanetName, radius, color, distance, orbitalSpeed, rotationSpeed] = data;
            
            // Find parent planet
            const parentPlanet = this.planets.find(p => p.name === parentPlanetName);
            if (!parentPlanet) return;
            
            // Create moon
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = this.createMoonMaterial(name, color);
            
            const moon = new THREE.Mesh(geometry, material);
            moon.castShadow = true;
            moon.receiveShadow = true;
            moon.userData = { name: name, parentPlanet: parentPlanetName };
            
            this.scene.add(moon);
            
            // Create moon's orbital path around its planet
            const moonOrbitPath = this.createMoonOrbitPath(distance, parentPlanet);
            this.scene.add(moonOrbitPath);
            this.orbitPaths.push(moonOrbitPath);
            
            // Store the tilt information from the orbit path for moon positioning
            const orbitTiltX = moonOrbitPath.rotation.x;
            const orbitTiltZ = moonOrbitPath.rotation.z;
            
            // Add to moons array
            this.moons.push({
                mesh: moon,
                name: name,
                parentPlanet: parentPlanet,
                distance: distance,
                speed: orbitalSpeed,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: rotationSpeed,
                orbitTiltX: orbitTiltX,
                orbitTiltZ: orbitTiltZ
            });
        });
        
        console.log(`Created ${moonData.length} moons`);
    }
    
    createMoonMaterial(moonName, baseColor) {
        switch(moonName.toLowerCase()) {
            case 'moon':
                // Earth's Moon - gray with craters
                const moonCanvas = this.createLunarTexture();
                return new THREE.MeshLambertMaterial({
                    map: new THREE.CanvasTexture(moonCanvas),
                    color: 0xcccccc
                });
                
            case 'io':
                // Io - volcanic with yellow sulfur
                return new THREE.MeshLambertMaterial({
                    color: 0xffff99,
                    emissive: 0x332200,
                    emissiveIntensity: 0.1
                });
                
            case 'europa':
                // Europa - icy surface
                return new THREE.MeshPhongMaterial({
                    color: 0xaaccff,
                    specular: 0x446688,
                    shininess: 80
                });
                
            case 'ganymede':
                // Ganymede - rocky/icy mix
                return new THREE.MeshLambertMaterial({
                    color: 0x887744
                });
                
            case 'callisto':
                // Callisto - dark, heavily cratered
                return new THREE.MeshLambertMaterial({
                    color: 0x444444
                });
                
            case 'titan':
                // Titan - orange atmosphere
                return new THREE.MeshLambertMaterial({
                    color: 0xddaa77,
                    transparent: true,
                    opacity: 0.9
                });
                
            default:
                return new THREE.MeshLambertMaterial({ color: baseColor });
        }
    }
    
    createLunarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Base gray surface
        ctx.fillStyle = '#999999';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add many small craters
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 8 + 2;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#666666');
            gradient.addColorStop(1, '#999999');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add a few large craters
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 15 + 10;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#444444');
            gradient.addColorStop(0.7, '#777777');
            gradient.addColorStop(1, '#999999');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas;
    }
    
    createMoonOrbitPath(radius, parentPlanet) {
        const curve = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            radius, radius,  // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,           // aClockwise
            0                // aRotation
        );
        
        const points = curve.getPoints(50); // Fewer points for moon orbits
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Convert 2D points to 3D
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 1];
            positions[i] = x;     // x stays x
            positions[i + 1] = 0; // y becomes 0 (flat orbit)
            positions[i + 2] = z; // y becomes z
        }
        
        const material = new THREE.LineDashedMaterial({
            color: 0x888888,
            dashSize: 0.5,
            gapSize: 0.3,
            opacity: 0.4,
            transparent: true
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        orbitLine.computeLineDistances();
        orbitLine.visible = this.showOrbits;
        orbitLine.userData = { isMoonOrbit: true, parentPlanet: parentPlanet };
        
        // Add random tilt to moon orbits (10-30 degrees)
        const tiltAngle = (Math.random() * 20 + 10) * Math.PI / 180; // Convert to radians
        const tiltAxis = Math.random() * Math.PI * 2; // Random axis direction
        
        orbitLine.rotation.x = Math.sin(tiltAxis) * tiltAngle;
        orbitLine.rotation.z = Math.cos(tiltAxis) * tiltAngle;
        
        return orbitLine;
    }
    
    createOrbitPath(radius) {
        const curve = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            radius, radius,  // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,           // aClockwise
            0                // aRotation
        );
        
        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Convert 2D points to 3D
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 1];
            positions[i] = x;     // x stays x
            positions[i + 1] = 0; // y becomes 0 (flat orbit)
            positions[i + 2] = z; // y becomes z
        }
        
        const material = new THREE.LineDashedMaterial({
            color: 0xaaaaff,
            dashSize: 1,
            gapSize: 0.5,
            opacity: 0.6,
            transparent: true
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        orbitLine.computeLineDistances(); // Required for dashed lines
        orbitLine.visible = this.showOrbits;
        
        return orbitLine;
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'KeyQ':
                    this.keys.forward = true;
                    break;
                case 'KeyA':
                    this.keys.backward = true;
                    break;
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case 'ArrowUp':
                    this.keys.up = true;
                    break;
                case 'ArrowDown':
                    this.keys.down = true;
                    break;
                case 'KeyP':
                    this.toggleOrbits();
                    break;
                case 'Digit0':
                    this.setSpeed(0);
                    break;
                case 'Digit1':
                    this.setSpeed(1);
                    break;
                case 'Digit2':
                    this.setSpeed(2);
                    break;
                case 'Digit3':
                    this.setSpeed(3);
                    break;
                case 'Digit4':
                    this.setSpeed(4);
                    break;
                case 'Digit5':
                    this.setSpeed(5);
                    break;
                case 'Digit6':
                    this.setSpeed(6);
                    break;
                case 'Digit7':
                    this.setSpeed(7);
                    break;
                case 'Digit8':
                    this.setSpeed(8);
                    break;
                case 'Digit9':
                    this.setSpeed(9);
                    break;
                case 'KeyM':
                    this.focusOnPlanet('Mercury');
                    break;
                case 'KeyV':
                    this.focusOnPlanet('Venus');
                    break;
                case 'KeyE':
                    this.focusOnPlanet('Earth');
                    break;
                case 'KeyR': // Mars starts with 'M' but Mercury already uses it, so use 'R' for "Red planet"
                    this.focusOnPlanet('Mars');
                    break;
                case 'KeyJ':
                    this.focusOnPlanet('Jupiter');
                    break;
                case 'KeyS':
                    this.focusOnPlanet('Saturn');
                    break;
                case 'KeyU':
                    this.focusOnPlanet('Uranus');
                    break;
                case 'KeyN':
                    this.focusOnPlanet('Neptune');
                    break;
                case 'Escape':
                    this.releasePlanetFocus();
                    break;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch(event.code) {
                case 'KeyQ':
                    this.keys.forward = false;
                    break;
                case 'KeyA':
                    this.keys.backward = false;
                    break;
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case 'ArrowUp':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                    this.keys.down = false;
                    break;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
    }
    
    setupMobileControls() {
        // Show mobile UI if on mobile device
        if (this.isMobile) {
            const mobileUI = document.getElementById('mobile-ui');
            if (mobileUI) {
                mobileUI.style.display = 'flex';
            }
            
            // Setup touch events for mobile devices
            this.setupTouchEvents();
        }
    }
    
    setupTouchEvents() {
        const canvas = this.renderer.domElement;
        
        // Touch start
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            
            if (event.touches.length === 1) {
                // Single touch - camera movement
                this.touchState.isMoving = true;
                this.touchState.startX = event.touches[0].clientX;
                this.touchState.startY = event.touches[0].clientY;
                this.controls.enabled = false; // Disable orbit controls for custom touch
            } else if (event.touches.length === 2) {
                // Two finger pinch - zoom
                this.touchState.isPinching = true;
                const dx = event.touches[0].clientX - event.touches[1].clientX;
                const dy = event.touches[0].clientY - event.touches[1].clientY;
                this.touchState.pinchDistance = Math.sqrt(dx * dx + dy * dy);
                this.controls.enabled = false;
            }
        }, { passive: false });
        
        // Touch move
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            
            if (event.touches.length === 1 && this.touchState.isMoving) {
                // Single touch movement
                const deltaX = event.touches[0].clientX - this.touchState.startX;
                const deltaY = event.touches[0].clientY - this.touchState.startY;
                
                // Apply camera rotation
                const sensitivity = 0.005;
                if (!this.focusedPlanet) {
                    this.camera.rotation.y -= deltaX * sensitivity;
                    this.camera.rotation.x -= deltaY * sensitivity;
                    
                    // Clamp vertical rotation
                    this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
                }
                
                this.touchState.startX = event.touches[0].clientX;
                this.touchState.startY = event.touches[0].clientY;
                
            } else if (event.touches.length === 2 && this.touchState.isPinching) {
                // Pinch zoom
                const dx = event.touches[0].clientX - event.touches[1].clientX;
                const dy = event.touches[0].clientY - event.touches[1].clientY;
                const currentDistance = Math.sqrt(dx * dx + dy * dy);
                
                const zoomFactor = currentDistance / this.touchState.pinchDistance;
                const zoomSpeed = 0.1;
                
                // Apply zoom
                this.camera.position.multiplyScalar(1 / (1 + (zoomFactor - 1) * zoomSpeed));
                
                this.touchState.pinchDistance = currentDistance;
            }
        }, { passive: false });
        
        // Touch end
        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            
            if (event.touches.length === 0) {
                // All touches ended
                this.touchState.isMoving = false;
                this.touchState.isPinching = false;
                
                if (!this.focusedPlanet) {
                    this.controls.enabled = true; // Re-enable orbit controls
                }
            } else if (event.touches.length === 1 && this.touchState.isPinching) {
                // One finger remaining after pinch
                this.touchState.isPinching = false;
                this.touchState.isMoving = true;
                this.touchState.startX = event.touches[0].clientX;
                this.touchState.startY = event.touches[0].clientY;
            }
        }, { passive: false });
        
        console.log('Mobile touch controls enabled');
    }
    
    setupMobileButtons() {
        // Initialize current speed level from existing settings
        this.currentSpeedLevel = Math.round(this.speedMultiplier * 9);
        
        // Setup info panel toggle
        this.setupInfoToggle();
        
        // Setup mobile UI toggle
        this.setupMobileUIToggle();
        
        // Setup control buttons
        this.setupControlButtons();
        
        // Setup planet buttons
        this.setupPlanetButtons();
        
        // Initial UI state update
        this.updateMobileUI();
    }
    
    setupInfoToggle() {
        const infoPanel = document.getElementById('info');
        
        if (infoPanel) {
            // Make entire info div clickable to toggle
            infoPanel.addEventListener('click', () => {
                infoPanel.classList.toggle('info-collapsed');
            });
            
            // Prevent bubbling when clicking the 3D canvas
            const container = document.getElementById('container');
            if (container) {
                container.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }
    }
    
    setupMobileUIToggle() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileUI = document.getElementById('mobile-ui');
        
        if (mobileToggle && mobileUI) {
            mobileToggle.addEventListener('click', () => {
                mobileUI.classList.toggle('mobile-ui-collapsed');
            });
        }
    }
    
    setupControlButtons() {
        // Setup toggle controls
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const action = event.target.closest('button').getAttribute('data-action');
                
                switch(action) {
                    case 'toggleOrbits':
                        this.toggleOrbits();
                        this.updateMobileUI();
                        break;
                    case 'releaseFocus':
                        this.releasePlanetFocus();
                        this.updateMobileUI();
                        break;
                }
            });
        });
    }
    
    setupPlanetButtons() {
        // Setup planet focus buttons
        document.querySelectorAll('.planet-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const planetName = event.target.getAttribute('data-planet');
                this.focusOnPlanet(planetName);
                this.updateMobileUI();
            });
        });
    }
    
    updateMobileUI() {
        // Update planet button states
        document.querySelectorAll('.planet-btn').forEach(btn => {
            const planetName = btn.getAttribute('data-planet');
            if (this.focusedPlanet && this.focusedPlanet.name === planetName) {
                btn.classList.add('focused');
            } else {
                btn.classList.remove('focused');
            }
        });
        
        // Update orbit toggle state
        const orbitToggle = document.getElementById('orbit-toggle');
        if (orbitToggle) {
            if (this.showOrbits) {
                orbitToggle.classList.add('active');
            } else {
                orbitToggle.classList.remove('active');
            }
        }
    }
    
    handleMovement() {
        const moveSpeed = 0.5;
        
        if (this.keys.forward) {
            this.camera.translateZ(-moveSpeed);
        }
        if (this.keys.backward) {
            this.camera.translateZ(moveSpeed);
        }
        if (this.keys.left) {
            this.camera.translateX(-moveSpeed);
        }
        if (this.keys.right) {
            this.camera.translateX(moveSpeed);
        }
        if (this.keys.up) {
            this.camera.translateY(moveSpeed);
        }
        if (this.keys.down) {
            this.camera.translateY(-moveSpeed);
        }
    }
    
    toggleOrbits() {
        this.showOrbits = !this.showOrbits;
        this.orbitPaths.forEach(orbitPath => {
            orbitPath.visible = this.showOrbits;
        });
        
        this.saveSettings();
        console.log(`Orbital paths ${this.showOrbits ? 'shown' : 'hidden'}`);
    }
    
    setSpeed(speedLevel, save = true) {
        // Convert speed level (0-9) to multiplier (0.0-1.0)
        this.speedMultiplier = speedLevel / 9.0;
        
        const speedText = speedLevel === 0 ? 'stopped' : 
                         speedLevel === 9 ? 'full speed' : 
                         `${Math.round(this.speedMultiplier * 100)}% speed`;
        
        if (save) {
            this.saveSettings();
        }
        console.log(`Animation speed set to: ${speedText}`);
    }
    
    focusOnPlanet(planetName, save = true) {
        const planet = this.planets.find(p => p.name === planetName);
        if (planet) {
            this.focusedPlanet = planet;
            this.controls.enabled = false; // Disable orbit controls when following
            if (save) {
                this.saveSettings();
            }
            
            // Update mobile UI if available
            if (this.updateMobileUI) {
                this.updateMobileUI();
            }
            
            console.log(`Focusing on ${planetName}`);
        }
    }
    
    releasePlanetFocus() {
        if (this.focusedPlanet) {
            console.log(`Released focus from ${this.focusedPlanet.name}`);
            this.focusedPlanet = null;
            this.controls.enabled = true; // Re-enable orbit controls
            this.saveSettings();
            
            // Update mobile UI if available
            if (this.updateMobileUI) {
                this.updateMobileUI();
            }
        }
    }
    
    updateCameraForFocusedPlanet() {
        if (this.focusedPlanet) {
            const planet = this.focusedPlanet;
            const planetPosition = planet.mesh.position;
            
            // Calculate camera position relative to planet
            const cameraOffset = new THREE.Vector3(
                this.cameraFollowDistance, 
                this.cameraFollowDistance * 0.5, 
                this.cameraFollowDistance
            );
            
            // Set camera position relative to planet
            this.camera.position.copy(planetPosition).add(cameraOffset);
            
            // Make camera look at the planet
            this.camera.lookAt(planetPosition);
        }
    }
    
    loadSettings() {
        try {
            // Store settings to apply later
            this.savedSettings = {};
            
            // Load speed setting
            const savedSpeed = localStorage.getItem('solarSystem_speedLevel');
            if (savedSpeed !== null) {
                this.savedSettings.speedLevel = parseInt(savedSpeed);
            }
            
            // Load orbit visibility
            const savedOrbits = localStorage.getItem('solarSystem_showOrbits');
            if (savedOrbits !== null) {
                this.savedSettings.showOrbits = JSON.parse(savedOrbits);
            }
            
            // Load focused planet
            const savedFocus = localStorage.getItem('solarSystem_focusedPlanet');
            if (savedFocus !== null && savedFocus !== 'null') {
                this.savedSettings.focusedPlanet = savedFocus;
            }
            
            console.log('Settings loaded from localStorage');
        } catch (error) {
            console.warn('Could not load settings:', error);
        }
    }
    
    applyLoadedSettings() {
        if (!this.savedSettings) return;
        
        try {
            // Apply speed setting
            if (this.savedSettings.speedLevel !== undefined) {
                this.setSpeed(this.savedSettings.speedLevel, false); // false = don't save again
            }
            
            // Apply orbit visibility
            if (this.savedSettings.showOrbits !== undefined) {
                this.showOrbits = this.savedSettings.showOrbits;
                this.orbitPaths.forEach(orbitPath => {
                    orbitPath.visible = this.showOrbits;
                });
            }
            
            // Apply focused planet
            if (this.savedSettings.focusedPlanet) {
                this.focusOnPlanet(this.savedSettings.focusedPlanet, false); // false = don't save again
            }
            
            // Update mobile UI after applying settings
            if (this.updateMobileUI) {
                this.updateMobileUI();
            }
            
            console.log('Settings applied');
        } catch (error) {
            console.warn('Could not apply settings:', error);
        }
    }
    
    saveSettings() {
        try {
            // Save current speed level (convert multiplier back to level)
            const speedLevel = Math.round(this.speedMultiplier * 9);
            localStorage.setItem('solarSystem_speedLevel', speedLevel.toString());
            
            // Save orbit visibility
            localStorage.setItem('solarSystem_showOrbits', JSON.stringify(this.showOrbits));
            
            // Save focused planet
            const focusedPlanetName = this.focusedPlanet ? this.focusedPlanet.name : null;
            localStorage.setItem('solarSystem_focusedPlanet', focusedPlanetName);
            
            console.log('Settings saved to localStorage');
        } catch (error) {
            console.warn('Could not save settings:', error);
        }
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Handle keyboard movement
        this.handleMovement();
        
        // Rotate sun and add solar activity
        if (this.sun) {
            this.sun.rotation.y += 0.0035 * this.speedMultiplier; // Reduced by 30%
            
            // Subtle solar activity simulation
            const time = Date.now() * 0.001;
            const emissiveIntensity = 0.8 + Math.sin(time * 0.5) * 0.1 + Math.sin(time * 0.7) * 0.05;
            this.sun.material.emissiveIntensity = emissiveIntensity;
        }
        
        // Animate planets
        this.planets.forEach(planet => {
            // Orbital motion
            planet.angle += planet.speed * this.speedMultiplier;
            planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
            
            // Planet rotation
            planet.mesh.rotation.y += planet.rotationSpeed * this.speedMultiplier;
            
            // Update Saturn's rings position
            if (planet.name === 'Saturn' && this.saturnRings) {
                this.saturnRings.position.copy(planet.mesh.position);
                
                // Only rotate around Y axis, preserve original X and Z tilt
                this.saturnRings.rotation.y += 0.001 * this.speedMultiplier; // Slow ring rotation
                this.saturnRings.rotation.x = this.saturnRingsOriginalTiltX; // Maintain original X tilt
                this.saturnRings.rotation.z = this.saturnRingsOriginalTiltZ; // Maintain original Z tilt
            }
        });
        
        // Animate moons
        this.moons.forEach(moon => {
            // Moon orbital motion around parent planet
            moon.angle += moon.speed * this.speedMultiplier;
            
            // Calculate moon position in tilted orbit relative to its parent planet
            const parentPos = moon.parentPlanet.mesh.position;
            
            // Base circular motion
            const baseX = Math.cos(moon.angle) * moon.distance;
            const baseY = 0;
            const baseZ = Math.sin(moon.angle) * moon.distance;
            
            // Apply tilt transformations
            // Rotate around X axis
            const tempY1 = baseY * Math.cos(moon.orbitTiltX) - baseZ * Math.sin(moon.orbitTiltX);
            const tempZ1 = baseY * Math.sin(moon.orbitTiltX) + baseZ * Math.cos(moon.orbitTiltX);
            
            // Rotate around Z axis
            const finalX = baseX * Math.cos(moon.orbitTiltZ) - tempY1 * Math.sin(moon.orbitTiltZ);
            const finalY = baseX * Math.sin(moon.orbitTiltZ) + tempY1 * Math.cos(moon.orbitTiltZ);
            const finalZ = tempZ1;
            
            moon.mesh.position.set(
                parentPos.x + finalX,
                parentPos.y + finalY,
                parentPos.z + finalZ
            );
            
            // Moon rotation
            moon.mesh.rotation.y += moon.rotationSpeed * this.speedMultiplier;
        });
        
        // Update moon orbit paths to follow their parent planets
        this.planets.forEach(planet => {
            this.orbitPaths.forEach(path => {
                if (path.userData.isMoonOrbit && path.userData.parentPlanet === planet) {
                    path.position.copy(planet.mesh.position);
                }
            });
        });
        
        // Update camera for planet focusing
        this.updateCameraForFocusedPlanet();
        
        // Update controls (only when not focusing on a planet)
        if (!this.focusedPlanet) {
            this.controls.update();
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.renderer.dispose();
        document.getElementById('container').removeChild(this.renderer.domElement);
    }
}

// Initialize the solar system when the page loads
window.addEventListener('load', () => {
    const solarSystem = new SolarSystem();
});

// Make sure to clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.solarSystem) {
        window.solarSystem.dispose();
    }
});
