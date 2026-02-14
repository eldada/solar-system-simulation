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
        this.asteroidBelt = null;
        
        // Texture URLs from Solar System Scope (CC BY 4.0) and NASA
        this.textureURLs = {
            sun: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
            mercury: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
            venus: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
            venusAtmosphere: 'https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg',
            earth: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
            earthClouds: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
            earthSpecular: 'https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg',
            mars: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
            jupiter: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
            saturn: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
            saturnRing: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png',
            uranus: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
            neptune: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
            moon: 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg',
            // Moon textures - using procedural for moons without good public textures
        };
        
        // Loaded textures cache
        this.textures = {};
        
        // Raycaster for planet click detection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Planet images data with NASA sources
        // Planet images using Wikimedia Special:FilePath (permanent redirect URLs) and NASA Photojournal
        this.planetImages = {
            'Mercury': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Mercury_in_true_color.jpg?width=800', source: 'https://en.wikipedia.org/wiki/Mercury_(planet)', caption: 'Mercury in true color - NASA/MESSENGER' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Mercury_Globe-MESSENGER_mosaic_centered_at_0degN-0degE.jpg?width=800', source: 'https://photojournal.jpl.nasa.gov/catalog/PIA15162', caption: 'Mercury MESSENGER mosaic - NASA/JHU APL' }
            ],
            'Venus': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Venus-real_color.jpg?width=800', source: 'https://en.wikipedia.org/wiki/Venus', caption: 'Venus in true color - NASA/Mariner 10' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Venus_globe_-_transparent_background.png?width=800', source: 'https://photojournal.jpl.nasa.gov/catalog/PIA00104', caption: 'Venus radar composite - NASA/Magellan' }
            ],
            'Earth': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/The_Blue_Marble_(remastered).jpg?width=800', source: 'https://en.wikipedia.org/wiki/The_Blue_Marble', caption: 'The Blue Marble - NASA/Apollo 17' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/The_Earth_seen_from_Apollo_17.jpg?width=800', source: 'https://images.nasa.gov/details-as17-148-22727', caption: 'Earth from Apollo 17 - NASA' }
            ],
            'Mars': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/OSIRIS_Mars_true_color.jpg?width=800', source: 'https://en.wikipedia.org/wiki/Mars', caption: 'Mars true color - ESA/Rosetta/OSIRIS' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Mars_Valles_Marineris.jpeg?width=800', source: 'https://photojournal.jpl.nasa.gov/catalog/PIA00422', caption: 'Valles Marineris hemisphere - NASA/Viking' }
            ],
            'Jupiter': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Jupiter_and_its_shrunken_Great_Red_Spot.jpg?width=800', source: 'https://hubblesite.org/', caption: 'Jupiter and Great Red Spot - NASA/Hubble' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Jupiter_New_Horizons.jpg?width=800', source: 'https://en.wikipedia.org/wiki/Jupiter', caption: 'Jupiter from New Horizons - NASA' }
            ],
            'Saturn': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Saturn_during_Equinox.jpg?width=800', source: 'https://en.wikipedia.org/wiki/Saturn', caption: 'Saturn at Equinox - NASA/Cassini' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Saturn-cassini-March-27-2004.jpg?width=800', source: 'https://photojournal.jpl.nasa.gov/', caption: 'Saturn from Cassini - NASA/JPL' }
            ],
            'Uranus': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Uranus2.jpg?width=800', source: 'https://en.wikipedia.org/wiki/Uranus', caption: 'Uranus - NASA/Voyager 2' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Uranus_as_seen_by_NASA%27s_Voyager_2_(remastered).png?width=800', source: 'https://photojournal.jpl.nasa.gov/catalog/PIA18182', caption: 'Uranus remastered - NASA/Voyager 2' }
            ],
            'Neptune': [
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Neptune_-_Voyager_2_(29347980845)_flatten_crop.jpg?width=800', source: 'https://en.wikipedia.org/wiki/Neptune', caption: 'Neptune - NASA/Voyager 2' },
                { url: 'https://en.wikipedia.org/wiki/Special:FilePath/Neptune_Full.jpg?width=800', source: 'https://photojournal.jpl.nasa.gov/catalog/PIA01492', caption: 'Neptune in true color - NASA/Voyager 2' }
            ]
        };
        
        // Animation control
        this.speedMultiplier = 1.0; // 0.0 to 1.0, where 1.0 is full speed
        this.showOrbits = false;
        
        // Planet focusing
        this.focusedPlanet = null;
        this.cameraFollowDistance = 8;
        
        // Smooth camera transitions
        this.cameraTransition = {
            active: false,
            startPosition: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            startLookAt: new THREE.Vector3(),
            targetLookAt: new THREE.Vector3(),
            progress: 0,
            duration: 2.0 // seconds
        };
        
        // Tour mode
        this.tourMode = {
            active: false,
            currentPlanetIndex: 0,
            timeAtPlanet: 0,
            pauseDuration: 10.0 // seconds to stay at each planet
        };
        
        // Planet facts panel
        this.factsPanel = null;
        
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
        this.initializePlanetFactsPanel();
        // Note: animate() is called after textures load in init()
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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // Initialize texture loader
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.crossOrigin = 'anonymous';
        
        // Add renderer to DOM
        const container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        
        // Add orbit controls (for mouse interaction)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enableZoom = true;
        this.controls.maxDistance = 2000;
        this.controls.minDistance = 10;
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.2;
        
        // Load textures and create scene
        this.loadTextures().then(() => {
            // Create basic scene
            this.createStarField();
            this.createSun();
            this.createPlanets();
            this.createSaturnRings();
            this.createMoons();
            this.createAsteroidBelt();
            
            // Apply loaded settings after everything is created
            this.applyLoadedSettings();
            
            // Hide loading indicator
            document.body.classList.add('scene-ready');
            
            // Start animation loop now that scene is fully built
            this.animate();
            
            console.log('Solar System initialized!');
        });
    }
    
    loadTextures() {
        return new Promise((resolve) => {
            const textureNames = Object.keys(this.textureURLs);
            let loadedCount = 0;
            const totalTextures = textureNames.length;
            
            const updateLoading = () => {
                const progress = Math.round((loadedCount / totalTextures) * 100);
                const loadingEl = document.getElementById('loading');
                if (loadingEl) {
                    loadingEl.textContent = `Loading textures... ${progress}%`;
                }
            };
            
            textureNames.forEach(name => {
                this.textureLoader.load(
                    this.textureURLs[name],
                    (texture) => {
                        this.textures[name] = texture;
                        loadedCount++;
                        updateLoading();
                        if (loadedCount === totalTextures) {
                            resolve();
                        }
                    },
                    undefined,
                    (error) => {
                        console.warn(`Failed to load texture: ${name}`, error);
                        this.textures[name] = null;
                        loadedCount++;
                        updateLoading();
                        if (loadedCount === totalTextures) {
                            resolve();
                        }
                    }
                );
            });
        });
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
        // Sun geometry and enhanced material with realistic texture
        const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
        
        // MeshBasicMaterial is self-lit (ignores scene lights), perfect for the sun
        // Note: MeshBasicMaterial does NOT support emissive - use color only
        let sunMaterial;
        if (this.textures.sun) {
            sunMaterial = new THREE.MeshBasicMaterial({
                map: this.textures.sun
            });
        } else {
            sunMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa00
            });
        }
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
        
        // Add corona/glow effect around the sun
        const coronaGeometry = new THREE.SphereGeometry(5.5, 32, 32);
        const coronaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd44,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        this.sun.add(corona);
        
        // Outer glow
        const glowGeometry = new THREE.SphereGeometry(6.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8800,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sun.add(glow);
        
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
        // Planet data: [name, radius, baseColor, distance, orbital_speed, rotation_speed]
        const planetData = [
            ['Mercury', 0.4, 0x8c6239, 15, 0.0049, 0.00245],
            ['Venus', 0.95, 0xffc649, 20, 0.00429, 0.000613],
            ['Earth', 1.0, 0x6b93d6, 30, 0.003675, 0.001225],
            ['Mars', 0.53, 0xcd5c5c, 40, 0.003063, 0.001225],
            ['Jupiter', 3.0, 0xd8ca9d, 70, 0.001838, 0.003063],
            ['Saturn', 2.5, 0xfad5a5, 100, 0.00147, 0.0028],
            ['Uranus', 1.6, 0x4fd0e7, 130, 0.00098, 0.001838],
            ['Neptune', 1.55, 0x4b70dd, 160, 0.000735, 0.001715]
        ];
        
        // Planet facts data for the information panel
        this.planetFacts = {
            'Mercury': {
                diameter: '4,879 km',
                sizeRatio: '0.38× Earth',
                distanceFromSun: '57.9 million km',
                dayLength: '58.6 Earth days',
                yearLength: '88 Earth days',
                moons: '0',
                description: 'The smallest planet and closest to the Sun'
            },
            'Venus': {
                diameter: '12,104 km',
                sizeRatio: '0.95× Earth',
                distanceFromSun: '108.2 million km',
                dayLength: '243 Earth days',
                yearLength: '225 Earth days',
                moons: '0',
                description: 'The hottest planet with thick toxic atmosphere'
            },
            'Earth': {
                diameter: '12,756 km',
                sizeRatio: '1.00× Earth',
                distanceFromSun: '149.6 million km',
                dayLength: '24 hours',
                yearLength: '365.25 days',
                moons: '1 (Moon)',
                description: 'Our home planet, the only known planet with life'
            },
            'Mars': {
                diameter: '6,792 km',
                sizeRatio: '0.53× Earth',
                distanceFromSun: '227.9 million km',
                dayLength: '24.6 hours',
                yearLength: '687 Earth days',
                moons: '2 (Phobos, Deimos)',
                description: 'The Red Planet, target for human exploration'
            },
            'Jupiter': {
                diameter: '142,984 km',
                sizeRatio: '11.21× Earth',
                distanceFromSun: '778.5 million km',
                dayLength: '9.9 hours',
                yearLength: '11.9 Earth years',
                moons: '95+ (showing Io, Europa, Ganymede, Callisto)',
                description: 'The largest planet with the Great Red Spot storm'
            },
            'Saturn': {
                diameter: '120,536 km',
                sizeRatio: '9.45× Earth',
                distanceFromSun: '1.43 billion km',
                dayLength: '10.7 hours',
                yearLength: '29.4 Earth years',
                moons: '146+ (showing 7 major moons)',
                description: 'Famous for its spectacular ring system'
            },
            'Uranus': {
                diameter: '51,118 km',
                sizeRatio: '4.01× Earth',
                distanceFromSun: '2.87 billion km',
                dayLength: '17.2 hours',
                yearLength: '84 Earth years',
                moons: '27 (showing 5 major moons)',
                description: 'Ice giant tilted on its side'
            },
            'Neptune': {
                diameter: '49,528 km',
                sizeRatio: '3.88× Earth',
                distanceFromSun: '4.50 billion km',
                dayLength: '16.1 hours',
                yearLength: '165 Earth years',
                moons: '16 (showing Triton, Nereid)',
                description: 'The windiest planet with supersonic storms'
            }
        };
        
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
            
            // Add Earth's cloud layer
            if (name === 'Earth' && this.textures.earthClouds) {
                const cloudGeometry = new THREE.SphereGeometry(radius * 1.02, 64, 64);
                const cloudMaterial = new THREE.MeshStandardMaterial({
                    map: this.textures.earthClouds,
                    transparent: true,
                    opacity: 0.4,
                    depthWrite: false
                });
                const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
                planet.add(cloudMesh);
                // Store reference for independent rotation
                planet.userData.clouds = cloudMesh;
            }
            
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
        
        // Create ring geometry with more detail
        const ringGeometry = new THREE.RingGeometry(3.2, 5.5, 128, 8);
        
        // Modify UVs for proper ring texture mapping
        const pos = ringGeometry.attributes.position;
        const uv = ringGeometry.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const distance = Math.sqrt(x * x + y * y);
            // Map UV to show ring bands
            uv.setXY(i, (distance - 3.2) / 2.3, 0.5);
        }
        
        // Create ring material with texture if available
        let ringMaterial;
        if (this.textures.saturnRing) {
            ringMaterial = new THREE.MeshBasicMaterial({
                map: this.textures.saturnRing,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide
            });
        } else {
            // Fallback - create procedural ring texture
            const ringCanvas = this.createSaturnRingTexture();
            ringMaterial = new THREE.MeshLambertMaterial({
                map: new THREE.CanvasTexture(ringCanvas),
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
        }
        
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
        
        // Add Uranus rings (fainter and tilted differently)
        this.createUranusRings();
        
        console.log('Saturn rings created');
    }
    
    createSaturnRingTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create gradient for ring bands
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(200, 180, 140, 0.1)');
        gradient.addColorStop(0.1, 'rgba(220, 200, 160, 0.7)');
        gradient.addColorStop(0.2, 'rgba(180, 160, 120, 0.3)');
        gradient.addColorStop(0.35, 'rgba(230, 210, 170, 0.8)');
        gradient.addColorStop(0.5, 'rgba(200, 180, 140, 0.4)');
        gradient.addColorStop(0.6, 'rgba(240, 220, 180, 0.9)');
        gradient.addColorStop(0.75, 'rgba(210, 190, 150, 0.5)');
        gradient.addColorStop(0.9, 'rgba(190, 170, 130, 0.6)');
        gradient.addColorStop(1, 'rgba(180, 160, 120, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        return canvas;
    }
    
    createUranusRings() {
        const uranus = this.planets.find(p => p.name === 'Uranus');
        if (!uranus) return;
        
        // Uranus has thin, dark rings
        const ringGeometry = new THREE.RingGeometry(2.0, 2.8, 64, 4);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x666688,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        this.uranusRings = new THREE.Mesh(ringGeometry, ringMaterial);
        // Uranus is tilted almost 90 degrees
        this.uranusRings.rotation.x = Math.PI / 2;
        this.uranusRings.rotation.y = Math.PI / 2.1; // Uranus's extreme axial tilt
        this.uranusRings.position.copy(uranus.mesh.position);
        
        this.scene.add(this.uranusRings);
    }
    
    createAsteroidBelt() {
        // Asteroid belt between Mars (distance 40) and Jupiter (distance 70)
        const asteroidCount = 1250;
        const innerRadius = 48;
        const outerRadius = 62;
        const beltHeight = 3; // Vertical scatter
        
        // Create asteroid geometry (small icosahedron for irregular shape)
        const asteroidGeometry = new THREE.IcosahedronGeometry(0.075, 0);
        
        // Create material for asteroids
        const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.9,
            metalness: 0.2,
            flatShading: true
        });
        
        // Use InstancedMesh for performance
        this.asteroidBelt = new THREE.InstancedMesh(
            asteroidGeometry,
            asteroidMaterial,
            asteroidCount
        );
        
        // Position each asteroid
        const dummy = new THREE.Object3D();
        const asteroidData = [];
        
        for (let i = 0; i < asteroidCount; i++) {
            // Random position in the belt ring
            const angle = Math.random() * Math.PI * 2;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const y = (Math.random() - 0.5) * beltHeight;
            
            // Add some clustering for Kirkwood gaps (resonance with Jupiter)
            // Skip certain radius ranges to simulate gaps
            const normalizedRadius = (radius - innerRadius) / (outerRadius - innerRadius);
            if (normalizedRadius > 0.3 && normalizedRadius < 0.35) continue;
            if (normalizedRadius > 0.5 && normalizedRadius < 0.55) continue;
            
            dummy.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            
            // Random rotation
            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Random scale (size variation) - halved
            const scale = 0.25 + Math.random() * 0.75;
            dummy.scale.set(scale, scale * (0.7 + Math.random() * 0.6), scale);
            
            dummy.updateMatrix();
            this.asteroidBelt.setMatrixAt(i, dummy.matrix);
            
            // Store orbital data for animation
            asteroidData.push({
                angle: angle,
                radius: radius,
                y: y,
                orbitalSpeed: 0.0005 + Math.random() * 0.001, // Slower than planets
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                scale: scale
            });
        }
        
        this.asteroidData = asteroidData;
        this.asteroidBelt.instanceMatrix.needsUpdate = true;
        this.scene.add(this.asteroidBelt);
        
        // Add a few larger named asteroids
        this.createNamedAsteroids();
        
        console.log(`Created asteroid belt with ${asteroidCount} asteroids`);
    }
    
    createNamedAsteroids() {
        // Major asteroids: Ceres (dwarf planet), Vesta, Pallas, Hygiea
        const namedAsteroids = [
            { name: 'Ceres', radius: 0.5, distance: 52, color: 0xaaaaaa },
            { name: 'Vesta', radius: 0.28, distance: 55, color: 0x999999 },
            { name: 'Pallas', radius: 0.27, distance: 58, color: 0x888888 },
            { name: 'Hygiea', radius: 0.22, distance: 54, color: 0x777777 }
        ];
        
        this.namedAsteroids = [];
        
        namedAsteroids.forEach(data => {
            const geometry = new THREE.IcosahedronGeometry(data.radius, 1);
            const material = new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: 0.95,
                metalness: 0.1,
                flatShading: true
            });
            
            const asteroid = new THREE.Mesh(geometry, material);
            const angle = Math.random() * Math.PI * 2;
            asteroid.position.set(
                Math.cos(angle) * data.distance,
                (Math.random() - 0.5) * 2,
                Math.sin(angle) * data.distance
            );
            
            asteroid.userData = { name: data.name };
            this.scene.add(asteroid);
            
            this.namedAsteroids.push({
                mesh: asteroid,
                name: data.name,
                distance: data.distance,
                angle: angle,
                speed: 0.00075 + Math.random() * 0.0005,
                rotationSpeed: 0.005
            });
        });
    }
    
    animateAsteroidBelt() {
        if (!this.asteroidBelt || !this.asteroidData) return;
        
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < this.asteroidData.length; i++) {
            const data = this.asteroidData[i];
            
            // Update orbital angle and tumble rotation
            data.angle += data.orbitalSpeed * this.speedMultiplier;
            data.rotAngle = (data.rotAngle || 0) + data.rotationSpeed.y * this.speedMultiplier;
            
            // Set position on orbit
            dummy.position.set(
                Math.cos(data.angle) * data.radius,
                data.y,
                Math.sin(data.angle) * data.radius
            );
            
            // Accumulated tumble rotation
            dummy.rotation.set(data.rotationSpeed.x * 10, data.rotAngle, data.rotationSpeed.z * 10);
            
            dummy.scale.set(data.scale, data.scale * 0.8, data.scale);
            
            dummy.updateMatrix();
            this.asteroidBelt.setMatrixAt(i, dummy.matrix);
        }
        
        this.asteroidBelt.instanceMatrix.needsUpdate = true;
        
        // Animate named asteroids
        if (this.namedAsteroids) {
            this.namedAsteroids.forEach(asteroid => {
                asteroid.angle += asteroid.speed * this.speedMultiplier;
                asteroid.mesh.position.x = Math.cos(asteroid.angle) * asteroid.distance;
                asteroid.mesh.position.z = Math.sin(asteroid.angle) * asteroid.distance;
                asteroid.mesh.rotation.y += asteroid.rotationSpeed * this.speedMultiplier;
            });
        }
    }
    
    createPlanetMaterial(planetName, baseColor) {
        // Create enhanced materials with realistic textures for each planet
        const name = planetName.toLowerCase();
        
        switch(name) {
            case 'mercury':
                if (this.textures.mercury) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.mercury,
                        roughness: 0.9,
                        metalness: 0.1
                    });
                }
                // Fallback to procedural
                const mercuryCanvas = this.createMercuryTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(mercuryCanvas),
                    bumpMap: new THREE.CanvasTexture(mercuryCanvas),
                    color: 0x8c6239,
                    shininess: 10,
                    bumpScale: 0.3
                });
                
            case 'venus':
                if (this.textures.venus) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.venus,
                        roughness: 0.8,
                        metalness: 0.0,
                        emissive: new THREE.Color(0x332200),
                        emissiveIntensity: 0.05
                    });
                }
                const venusCanvas = this.createVenusTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(venusCanvas),
                    color: 0xffc649,
                    emissive: 0x332200,
                    emissiveIntensity: 0.1,
                    shininess: 100
                });
                
            case 'earth':
                if (this.textures.earth) {
                    const earthMaterial = new THREE.MeshStandardMaterial({
                        map: this.textures.earth,
                        roughness: 0.5,
                        metalness: 0.1
                    });
                    // Add specular map for oceans if available
                    if (this.textures.earthSpecular) {
                        earthMaterial.roughnessMap = this.textures.earthSpecular;
                    }
                    return earthMaterial;
                }
                const earthCanvas = this.createEarthTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(earthCanvas),
                    color: 0x6b93d6,
                    specular: 0x222222,
                    shininess: 100
                });
                
            case 'mars':
                if (this.textures.mars) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.mars,
                        roughness: 0.85,
                        metalness: 0.1
                    });
                }
                const marsCanvas = this.createMarsTexture();
                return new THREE.MeshLambertMaterial({
                    map: new THREE.CanvasTexture(marsCanvas),
                    color: 0xcd5c5c,
                    emissive: 0x110000,
                    emissiveIntensity: 0.05
                });
                
            case 'jupiter':
                if (this.textures.jupiter) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.jupiter,
                        roughness: 0.7,
                        metalness: 0.0
                    });
                }
                const jupiterCanvas = this.createJupiterTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(jupiterCanvas),
                    color: 0xd8ca9d,
                    specular: 0x111111,
                    shininess: 30
                });
                
            case 'saturn':
                if (this.textures.saturn) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.saturn,
                        roughness: 0.7,
                        metalness: 0.0
                    });
                }
                const saturnCanvas = this.createSaturnTexture();
                return new THREE.MeshPhongMaterial({
                    map: new THREE.CanvasTexture(saturnCanvas),
                    color: 0xfad5a5,
                    specular: 0x111111,
                    shininess: 40
                });
                
            case 'uranus':
                if (this.textures.uranus) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.uranus,
                        roughness: 0.6,
                        metalness: 0.0
                    });
                }
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
                if (this.textures.neptune) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.neptune,
                        roughness: 0.6,
                        metalness: 0.0
                    });
                }
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
        // Moon data: [name, parentPlanet, radius, color, distance, orbital_speed, rotation_speed]
        const moonData = [
            // Earth's Moon
            ['Moon', 'Earth', 0.27, 0xcccccc, 4, 0.0175, 0.0175],
            
            // Mars's moons - small and irregular
            ['Phobos', 'Mars', 0.06, 0x666666, 2.0, 0.04, 0.04],
            ['Deimos', 'Mars', 0.04, 0x555555, 3.0, 0.025, 0.025],
            
            // Jupiter's major moons (Galilean moons)
            ['Io', 'Jupiter', 0.18, 0xffff99, 6, 0.028, 0.028],
            ['Europa', 'Jupiter', 0.16, 0xaaccff, 8, 0.021, 0.021],
            ['Ganymede', 'Jupiter', 0.26, 0x887744, 10, 0.0175, 0.0175],
            ['Callisto', 'Jupiter', 0.24, 0x444444, 13, 0.014, 0.014],
            
            // Saturn's major moons
            ['Titan', 'Saturn', 0.26, 0xddaa77, 8, 0.021, 0.021],
            ['Rhea', 'Saturn', 0.12, 0xdddddd, 6.5, 0.025, 0.025],
            ['Iapetus', 'Saturn', 0.11, 0x888888, 10, 0.014, 0.014],
            ['Dione', 'Saturn', 0.09, 0xcccccc, 5.5, 0.0275, 0.0275],
            ['Tethys', 'Saturn', 0.08, 0xdddddd, 4.8, 0.03, 0.03],
            ['Enceladus', 'Saturn', 0.06, 0xffffff, 4.2, 0.0325, 0.0325],
            ['Mimas', 'Saturn', 0.05, 0xaaaaaa, 3.8, 0.035, 0.035],
            
            // Uranus's major moons
            ['Miranda', 'Uranus', 0.06, 0xaaaaaa, 3.0, 0.03, 0.03],
            ['Ariel', 'Uranus', 0.09, 0xbbbbbb, 4.0, 0.025, 0.025],
            ['Umbriel', 'Uranus', 0.09, 0x666666, 5.0, 0.0225, 0.0225],
            ['Titania', 'Uranus', 0.12, 0x999999, 6.5, 0.019, 0.019],
            ['Oberon', 'Uranus', 0.11, 0x777777, 8.0, 0.016, 0.016],
            
            // Neptune's major moons
            ['Triton', 'Neptune', 0.14, 0xddccbb, 5.0, 0.0225, 0.0225],
            ['Nereid', 'Neptune', 0.04, 0xaaaaaa, 8.0, 0.01, 0.01]
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
        const name = moonName.toLowerCase();
        
        switch(name) {
            case 'moon':
                // Earth's Moon - use realistic texture if available
                if (this.textures.moon) {
                    return new THREE.MeshStandardMaterial({
                        map: this.textures.moon,
                        roughness: 0.95,
                        metalness: 0.0
                    });
                }
                const moonCanvas = this.createLunarTexture();
                return new THREE.MeshLambertMaterial({
                    map: new THREE.CanvasTexture(moonCanvas),
                    color: 0xcccccc
                });
                
            case 'io':
                // Io - volcanic with yellow sulfur - create detailed procedural
                return new THREE.MeshStandardMaterial({
                    color: 0xffee88,
                    roughness: 0.8,
                    metalness: 0.0,
                    emissive: new THREE.Color(0x442200),
                    emissiveIntensity: 0.1,
                    map: new THREE.CanvasTexture(this.createIoTexture())
                });
                
            case 'europa':
                // Europa - icy surface with cracks
                return new THREE.MeshStandardMaterial({
                    color: 0xddeeff,
                    roughness: 0.3,
                    metalness: 0.1,
                    map: new THREE.CanvasTexture(this.createEuropaTexture())
                });
                
            case 'ganymede':
                // Ganymede - rocky/icy mix, largest moon
                return new THREE.MeshStandardMaterial({
                    color: 0x998877,
                    roughness: 0.7,
                    metalness: 0.0,
                    map: new THREE.CanvasTexture(this.createGanymedeTexture())
                });
                
            case 'callisto':
                // Callisto - dark, heavily cratered
                return new THREE.MeshStandardMaterial({
                    color: 0x555555,
                    roughness: 0.9,
                    metalness: 0.0,
                    map: new THREE.CanvasTexture(this.createCallistoTexture())
                });
                
            case 'titan':
                // Titan - orange atmosphere, hazy
                return new THREE.MeshStandardMaterial({
                    color: 0xeeaa66,
                    roughness: 0.5,
                    metalness: 0.0,
                    transparent: true,
                    opacity: 0.95,
                    map: new THREE.CanvasTexture(this.createTitanTexture())
                });
                
            case 'phobos':
            case 'deimos':
                // Mars moons - small, irregular, dark gray
                return new THREE.MeshStandardMaterial({
                    color: 0x666666,
                    roughness: 0.95,
                    metalness: 0.1
                });
                
            case 'enceladus':
                // Enceladus - bright icy surface
                return new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.2,
                    metalness: 0.1
                });
                
            case 'rhea':
            case 'dione':
            case 'tethys':
            case 'mimas':
                // Saturn's icy moons
                return new THREE.MeshStandardMaterial({
                    color: 0xdddddd,
                    roughness: 0.4,
                    metalness: 0.0
                });
                
            case 'iapetus':
                // Iapetus - two-toned (dark and light)
                return new THREE.MeshStandardMaterial({
                    color: 0x888888,
                    roughness: 0.7,
                    metalness: 0.0,
                    map: new THREE.CanvasTexture(this.createIapetusTexture())
                });
                
            case 'miranda':
            case 'ariel':
            case 'umbriel':
            case 'titania':
            case 'oberon':
                // Uranus moons - icy/rocky
                const uranianColors = {
                    'miranda': 0xaaaaaa,
                    'ariel': 0xbbbbbb,
                    'umbriel': 0x666666,
                    'titania': 0x999999,
                    'oberon': 0x777777
                };
                return new THREE.MeshStandardMaterial({
                    color: uranianColors[name] || 0x888888,
                    roughness: 0.6,
                    metalness: 0.0
                });
                
            case 'triton':
                // Triton - pinkish nitrogen ice
                return new THREE.MeshStandardMaterial({
                    color: 0xddccbb,
                    roughness: 0.4,
                    metalness: 0.0,
                    map: new THREE.CanvasTexture(this.createTritonTexture())
                });
                
            case 'nereid':
                // Nereid - irregular icy
                return new THREE.MeshStandardMaterial({
                    color: 0xaaaaaa,
                    roughness: 0.7,
                    metalness: 0.0
                });
                
            default:
                return new THREE.MeshLambertMaterial({ color: baseColor });
        }
    }
    
    createIoTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Yellow/orange volcanic surface
        ctx.fillStyle = '#ddcc44';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add volcanic spots
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 15 + 5;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#ff4400');
            gradient.addColorStop(0.5, '#ff8800');
            gradient.addColorStop(1, '#ddcc44');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas;
    }
    
    createEuropaTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Light icy surface
        ctx.fillStyle = '#ddeeff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add cracks/lineae
        ctx.strokeStyle = '#8899aa';
        ctx.lineWidth = 1;
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    createGanymedeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Mixed terrain
        ctx.fillStyle = '#887766';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Light grooved terrain patches
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = '#aaaaaa';
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 50 + 20,
                Math.random() * 30 + 10
            );
        }
        
        return canvas;
    }
    
    createCallistoTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Dark surface
        ctx.fillStyle = '#444444';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Many craters
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 8 + 2;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#333333');
            gradient.addColorStop(0.7, '#555555');
            gradient.addColorStop(1, '#444444');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas;
    }
    
    createTitanTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Orange hazy atmosphere
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ee9944');
        gradient.addColorStop(0.5, '#ddaa66');
        gradient.addColorStop(1, '#cc8833');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Subtle cloud bands
        ctx.fillStyle = 'rgba(255, 200, 150, 0.3)';
        for (let y = 0; y < canvas.height; y += 20) {
            ctx.fillRect(0, y, canvas.width, 8);
        }
        
        return canvas;
    }
    
    createIapetusTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Two-toned - dark leading hemisphere, bright trailing
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        
        return canvas;
    }
    
    createTritonTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Pinkish nitrogen ice
        ctx.fillStyle = '#ddccbb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dark streaks (geysers)
        ctx.strokeStyle = '#554433';
        ctx.lineWidth = 2;
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, canvas.height);
            ctx.lineTo(x + (Math.random() - 0.5) * 30, Math.random() * canvas.height);
            ctx.stroke();
        }
        
        return canvas;
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
            // Skip camera controls when gallery is open (gallery handler takes precedence)
            if (this.imageGallery && !this.imageGallery.classList.contains('hidden')) return;
            
            switch(event.code) {
                case 'KeyQ':
                    this.keys.forward = true;
                    break;
                case 'KeyA':
                    this.keys.backward = true;
                    break;
                case 'ArrowLeft':
                    if (this.tourMode.active) {
                        this.tourPrev();
                    } else {
                        this.keys.left = true;
                    }
                    break;
                case 'ArrowRight':
                    if (this.tourMode.active) {
                        this.tourNext();
                    } else {
                        this.keys.right = true;
                    }
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
                case 'KeyT':
                    this.toggleTour();
                    break;
                case 'Escape':
                    if (this.tourMode.active) {
                        this.stopTour();
                    } else {
                        this.releasePlanetFocus();
                    }
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
        
        // Setup speed slider
        this.setupSpeedSlider();
        
        // Setup mobile gestures (swipe, double-tap)
        this.setupMobileGestures();
        
        // Initial UI state update
        this.updateMobileUI();
    }
    
    setupSpeedSlider() {
        const slider = document.getElementById('speed-slider');
        const valueDisplay = document.getElementById('speed-value');
        
        if (slider) {
            // Set initial value
            slider.value = Math.round(this.speedMultiplier * 9);
            this.updateSpeedDisplay(slider.value, valueDisplay);
            
            // Handle slider change
            slider.addEventListener('input', (event) => {
                const speedLevel = parseInt(event.target.value);
                this.setSpeed(speedLevel);
                this.updateSpeedDisplay(speedLevel, valueDisplay);
            });
        }
    }
    
    updateSpeedDisplay(level, displayElement) {
        if (!displayElement) {
            displayElement = document.getElementById('speed-value');
        }
        
        if (displayElement) {
            if (level === 0) {
                displayElement.textContent = 'Paused';
            } else {
                const percent = Math.round((level / 9) * 100);
                displayElement.textContent = `${percent}%`;
            }
        }
        
        // Also update slider position if speed was changed via keyboard
        const slider = document.getElementById('speed-slider');
        if (slider && parseInt(slider.value) !== level) {
            slider.value = level;
        }
    }
    
    setupMobileGestures() {
        if (!this.isMobile) return;
        
        const canvas = this.renderer.domElement;
        
        // Double-tap detection
        let lastTapTime = 0;
        let lastTapX = 0;
        let lastTapY = 0;
        
        canvas.addEventListener('touchend', (event) => {
            const currentTime = Date.now();
            const touch = event.changedTouches[0];
            
            // Check for double tap
            const timeDiff = currentTime - lastTapTime;
            const distDiff = Math.sqrt(
                Math.pow(touch.clientX - lastTapX, 2) + 
                Math.pow(touch.clientY - lastTapY, 2)
            );
            
            if (timeDiff < 300 && distDiff < 50) {
                // Double tap detected - try to focus on closest planet
                this.handleDoubleTap(touch.clientX, touch.clientY);
                lastTapTime = 0; // Reset to prevent triple-tap
            } else {
                lastTapTime = currentTime;
                lastTapX = touch.clientX;
                lastTapY = touch.clientY;
            }
        }, { passive: true });
        
        // Swipe gesture for planet navigation (when focused)
        let swipeStartX = 0;
        let swipeStartY = 0;
        let swipeStartTime = 0;
        
        canvas.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                swipeStartX = event.touches[0].clientX;
                swipeStartY = event.touches[0].clientY;
                swipeStartTime = Date.now();
            }
        }, { passive: true });
        
        canvas.addEventListener('touchend', (event) => {
            if (!this.focusedPlanet) return;
            
            const touch = event.changedTouches[0];
            const swipeEndX = touch.clientX;
            const swipeEndY = touch.clientY;
            const swipeDuration = Date.now() - swipeStartTime;
            
            const deltaX = swipeEndX - swipeStartX;
            const deltaY = swipeEndY - swipeStartY;
            
            // Check for horizontal swipe (quick, mostly horizontal)
            if (swipeDuration < 500 && Math.abs(deltaX) > 80 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
                if (deltaX > 0) {
                    // Swipe right - previous planet
                    this.focusPreviousPlanet();
                } else {
                    // Swipe left - next planet
                    this.focusNextPlanet();
                }
            }
        }, { passive: true });
    }
    
    handleDoubleTap(x, y) {
        // Try to detect planet under tap
        this.mouse.x = (x / window.innerWidth) * 2 - 1;
        this.mouse.y = -(y / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const planetMeshes = this.planets.map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            const planetName = intersects[0].object.userData.name;
            if (planetName) {
                this.focusOnPlanet(planetName);
                return;
            }
        }
        
        // If no planet found, toggle free cam / release focus
        if (this.focusedPlanet) {
            this.releasePlanetFocus();
        }
    }
    
    focusPreviousPlanet() {
        if (!this.focusedPlanet) return;
        
        const currentIndex = this.planets.findIndex(p => p.name === this.focusedPlanet.name);
        const prevIndex = (currentIndex - 1 + this.planets.length) % this.planets.length;
        this.focusOnPlanet(this.planets[prevIndex].name);
        this.updateMobileUI();
    }
    
    focusNextPlanet() {
        if (!this.focusedPlanet) return;
        
        const currentIndex = this.planets.findIndex(p => p.name === this.focusedPlanet.name);
        const nextIndex = (currentIndex + 1) % this.planets.length;
        this.focusOnPlanet(this.planets[nextIndex].name);
        this.updateMobileUI();
    }
    
    initializePlanetFactsPanel() {
        // Get reference to facts panel
        this.factsPanel = document.getElementById('planet-facts-panel');
        
        // Setup close button event listener
        const closeBtn = document.getElementById('planet-facts-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hidePlanetFacts();
                this.releasePlanetFocus();
            });
        }
        
        // Setup click detection for planets
        this.setupPlanetClickDetection();
        
        // Initialize image gallery
        this.initializeImageGallery();
        
        console.log('Planet facts panel initialized');
    }
    
    setupPlanetClickDetection() {
        const canvas = this.renderer.domElement;
        
        // Track if this is a click vs drag
        let mouseDownTime = 0;
        let mouseDownPos = { x: 0, y: 0 };
        
        canvas.addEventListener('mousedown', (event) => {
            mouseDownTime = Date.now();
            mouseDownPos = { x: event.clientX, y: event.clientY };
        });
        
        canvas.addEventListener('mouseup', (event) => {
            const clickDuration = Date.now() - mouseDownTime;
            const moveDistance = Math.sqrt(
                Math.pow(event.clientX - mouseDownPos.x, 2) + 
                Math.pow(event.clientY - mouseDownPos.y, 2)
            );
            
            // Only count as click if short duration and minimal movement
            if (clickDuration < 300 && moveDistance < 10) {
                this.handlePlanetClick(event);
            }
        });
        
        // Touch support for mobile
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        
        canvas.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                touchStartTime = Date.now();
                touchStartPos = { 
                    x: event.touches[0].clientX, 
                    y: event.touches[0].clientY 
                };
            }
        }, { passive: true });
        
        canvas.addEventListener('touchend', (event) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Single tap detection (not used for drag)
            if (touchDuration < 300 && event.changedTouches.length === 1) {
                const moveDistance = Math.sqrt(
                    Math.pow(event.changedTouches[0].clientX - touchStartPos.x, 2) + 
                    Math.pow(event.changedTouches[0].clientY - touchStartPos.y, 2)
                );
                
                if (moveDistance < 20) {
                    this.handlePlanetClick({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY
                    });
                }
            }
        }, { passive: true });
    }
    
    handlePlanetClick(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get all planet meshes
        const planetMeshes = this.planets.map(p => p.mesh);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object;
            const planetName = clickedPlanet.userData.name;
            
            if (planetName) {
                console.log(`Clicked on ${planetName}`);
                this.showImageGallery(planetName);
            }
        }
    }
    
    initializeImageGallery() {
        // Get gallery elements
        this.imageGallery = document.getElementById('image-gallery-modal');
        this.currentImageIndex = 0;
        this.currentPlanetImages = [];
        
        // Setup gallery close button
        const closeBtn = document.getElementById('gallery-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideImageGallery());
        }
        
        // Setup navigation buttons
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.showPreviousImage());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.showNextImage());
        }
        
        // Close on backdrop click
        if (this.imageGallery) {
            this.imageGallery.addEventListener('click', (event) => {
                if (event.target === this.imageGallery) {
                    this.hideImageGallery();
                }
            });
        }
        
        // Keyboard navigation - must stopPropagation to prevent arrow keys from also moving camera
        document.addEventListener('keydown', (event) => {
            if (!this.imageGallery || this.imageGallery.classList.contains('hidden')) return;
            
            switch(event.key) {
                case 'Escape':
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.hideImageGallery();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.showPreviousImage();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.showNextImage();
                    break;
            }
        });
        
        // Swipe support for mobile gallery
        if (this.imageGallery) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.imageGallery.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.imageGallery.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                
                if (Math.abs(swipeDistance) > 50) {
                    if (swipeDistance > 0) {
                        this.showPreviousImage();
                    } else {
                        this.showNextImage();
                    }
                }
            }, { passive: true });
        }
    }
    
    showImageGallery(planetName) {
        if (!this.imageGallery || !this.planetImages[planetName]) return;
        
        this.currentPlanetImages = this.planetImages[planetName];
        this.currentImageIndex = 0;
        
        // Update gallery title
        const title = document.getElementById('gallery-title');
        if (title) {
            title.textContent = `${planetName} - NASA Images`;
        }
        
        // Show first image
        this.updateGalleryImage();
        
        // Show gallery
        this.imageGallery.classList.remove('hidden');
        
        // Also focus on the planet
        this.focusOnPlanet(planetName);
    }
    
    hideImageGallery() {
        if (this.imageGallery) {
            this.imageGallery.classList.add('hidden');
        }
    }
    
    updateGalleryImage() {
        if (!this.currentPlanetImages || this.currentPlanetImages.length === 0) return;
        
        const imageData = this.currentPlanetImages[this.currentImageIndex];
        
        const imageEl = document.getElementById('gallery-image');
        const captionEl = document.getElementById('gallery-caption');
        const sourceLink = document.getElementById('gallery-source');
        const counterEl = document.getElementById('gallery-counter');
        
        if (imageEl) {
            imageEl.style.opacity = '0.3';
            imageEl.onerror = () => {
                imageEl.style.opacity = '1';
                imageEl.src = '';
                imageEl.alt = 'Image unavailable - click View Source to see it on the web';
                if (captionEl) captionEl.textContent = imageData.caption + ' (image unavailable)';
            };
            imageEl.onload = () => {
                imageEl.style.opacity = '1';
            };
            imageEl.src = imageData.url;
            imageEl.alt = imageData.caption;
        }
        
        if (captionEl) {
            captionEl.textContent = imageData.caption;
        }
        
        if (sourceLink) {
            sourceLink.href = imageData.source;
            sourceLink.textContent = 'View Source';
        }
        
        if (counterEl) {
            counterEl.textContent = `${this.currentImageIndex + 1} / ${this.currentPlanetImages.length}`;
        }
    }
    
    showPreviousImage() {
        if (this.currentPlanetImages.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex - 1 + this.currentPlanetImages.length) % this.currentPlanetImages.length;
        this.updateGalleryImage();
    }
    
    showNextImage() {
        if (this.currentPlanetImages.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.currentPlanetImages.length;
        this.updateGalleryImage();
    }
    
    showPlanetFacts(planetName) {
        if (!this.factsPanel || !this.planetFacts[planetName]) return;
        
        const facts = this.planetFacts[planetName];
        
        // Update panel title
        const title = document.getElementById('planet-facts-title');
        if (title) {
            title.textContent = `${planetName} Facts`;
        }
        
        // Update description
        const descriptionEl = document.getElementById('planet-description');
        if (descriptionEl) descriptionEl.textContent = facts.description || '';
        
        // Update all fact values
        const diameterEl = document.getElementById('planet-diameter');
        if (diameterEl) diameterEl.textContent = facts.diameter;
        
        const sizeRatioEl = document.getElementById('planet-size-ratio');
        if (sizeRatioEl) sizeRatioEl.textContent = facts.sizeRatio;
        
        const distanceEl = document.getElementById('planet-distance');
        if (distanceEl) distanceEl.textContent = facts.distanceFromSun;
        
        const dayEl = document.getElementById('planet-day');
        if (dayEl) dayEl.textContent = facts.dayLength;
        
        const yearEl = document.getElementById('planet-year');
        if (yearEl) yearEl.textContent = facts.yearLength;
        
        const moonsEl = document.getElementById('planet-moons');
        if (moonsEl) moonsEl.textContent = facts.moons;
        
        // Show the panel
        this.factsPanel.classList.remove('planet-facts-hidden');
        
        console.log(`Showing facts for ${planetName}`);
    }
    
    hidePlanetFacts() {
        if (!this.factsPanel) return;
        
        // Hide the panel
        this.factsPanel.classList.add('planet-facts-hidden');
        
        console.log('Planet facts panel hidden');
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
                    case 'toggleTour':
                        this.toggleTour();
                        this.updateMobileUI();
                        break;
                    case 'releaseFocus':
                        if (this.tourMode.active) {
                            this.stopTour();
                        }
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
        
        // Update speed slider display (mobile)
        this.updateSpeedDisplay(speedLevel);
        
        // Show desktop speed indicator briefly
        this.showDesktopSpeedIndicator(speedLevel, speedText);
        
        if (save) {
            this.saveSettings();
        }
        console.log(`Animation speed set to: ${speedText}`);
    }
    
    showDesktopSpeedIndicator(speedLevel, speedText) {
        const indicator = document.getElementById('desktop-speed-indicator');
        const label = document.getElementById('desktop-speed-label');
        if (!indicator || !label) return;
        
        label.textContent = `Speed: ${speedLevel} — ${speedText}`;
        indicator.classList.remove('hidden');
        
        // Clear any existing timeout
        if (this._speedIndicatorTimeout) {
            clearTimeout(this._speedIndicatorTimeout);
        }
        
        // Hide after 1.5 seconds
        this._speedIndicatorTimeout = setTimeout(() => {
            indicator.classList.add('hidden');
        }, 1500);
    }
    
    focusOnPlanet(planetName, save = true, smooth = true) {
        const planet = this.planets.find(p => p.name === planetName);
        if (planet) {
            this.focusedPlanet = planet;
            this.controls.enabled = false; // Disable orbit controls when following
            
            // Calculate target camera position
            const planetPosition = planet.mesh.position.clone();
            const cameraOffset = new THREE.Vector3(
                this.cameraFollowDistance, 
                this.cameraFollowDistance * 0.5, 
                this.cameraFollowDistance
            );
            const targetPosition = planetPosition.clone().add(cameraOffset);
            
            if (smooth) {
                // Start smooth transition
                this.startCameraTransition(targetPosition, planetPosition);
            } else {
                // Instant move
                this.camera.position.copy(targetPosition);
                this.camera.lookAt(planetPosition);
            }
            
            // Show planet facts panel
            this.showPlanetFacts(planetName);
            
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
    
    startCameraTransition(targetPosition, targetLookAt) {
        this.cameraTransition.active = true;
        this.cameraTransition.progress = 0;
        
        // Store start position and look-at
        this.cameraTransition.startPosition.copy(this.camera.position);
        this.cameraTransition.targetPosition.copy(targetPosition);
        
        // Calculate current look-at point (approximate)
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        this.cameraTransition.startLookAt.copy(this.camera.position).add(direction.multiplyScalar(10));
        this.cameraTransition.targetLookAt.copy(targetLookAt);
    }
    
    updateCameraTransition(deltaTime) {
        if (!this.cameraTransition.active) return;
        
        // Update progress
        this.cameraTransition.progress += deltaTime / this.cameraTransition.duration;
        
        if (this.cameraTransition.progress >= 1) {
            this.cameraTransition.progress = 1;
            this.cameraTransition.active = false;
        }
        
        // Easing function (ease in-out cubic)
        const t = this.cameraTransition.progress;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        // Interpolate position
        this.camera.position.lerpVectors(
            this.cameraTransition.startPosition,
            this.cameraTransition.targetPosition,
            ease
        );
        
        // Interpolate look-at
        const currentLookAt = new THREE.Vector3().lerpVectors(
            this.cameraTransition.startLookAt,
            this.cameraTransition.targetLookAt,
            ease
        );
        this.camera.lookAt(currentLookAt);
    }
    
    // Tour mode methods
    startTour() {
        this.tourMode.active = true;
        this.tourMode.currentPlanetIndex = 0;
        this.tourMode.timeAtPlanet = 0;
        
        // Focus on first planet
        const firstPlanet = this.planets[0];
        if (firstPlanet) {
            this.focusOnPlanet(firstPlanet.name, false, true);
        }
        
        // Build tour dots and set up nav buttons
        this.initTourNav();
        
        // Update UI
        this.updateTourUI(true);
        
        console.log('Tour mode started');
    }
    
    stopTour() {
        this.tourMode.active = false;
        this.releasePlanetFocus();
        
        // Update UI
        this.updateTourUI(false);
        
        console.log('Tour mode stopped');
    }
    
    toggleTour() {
        if (this.tourMode.active) {
            this.stopTour();
        } else {
            this.startTour();
        }
    }
    
    tourNext() {
        if (!this.tourMode.active) return;
        this.tourMode.timeAtPlanet = 0;
        this.tourMode.currentPlanetIndex = (this.tourMode.currentPlanetIndex + 1) % this.planets.length;
        
        const planet = this.planets[this.tourMode.currentPlanetIndex];
        if (planet) {
            this.focusOnPlanet(planet.name, false, true);
            this.updateTourIndicator();
        }
    }
    
    tourPrev() {
        if (!this.tourMode.active) return;
        this.tourMode.timeAtPlanet = 0;
        this.tourMode.currentPlanetIndex = (this.tourMode.currentPlanetIndex - 1 + this.planets.length) % this.planets.length;
        
        const planet = this.planets[this.tourMode.currentPlanetIndex];
        if (planet) {
            this.focusOnPlanet(planet.name, false, true);
            this.updateTourIndicator();
        }
    }
    
    initTourNav() {
        // Build planet dots
        const dotsContainer = document.getElementById('tour-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            this.planets.forEach((planet, i) => {
                const dot = document.createElement('span');
                dot.className = 'tour-dot' + (i === 0 ? ' active' : '');
                dot.title = planet.name;
                dot.addEventListener('click', () => {
                    if (!this.tourMode.active) return;
                    this.tourMode.timeAtPlanet = 0;
                    this.tourMode.currentPlanetIndex = i;
                    this.focusOnPlanet(planet.name, false, true);
                    this.updateTourIndicator();
                });
                dotsContainer.appendChild(dot);
            });
        }
        
        // Attach prev/next button handlers (remove old listeners by replacing)
        const prevBtn = document.getElementById('tour-prev');
        const nextBtn = document.getElementById('tour-next');
        if (prevBtn) {
            const newPrev = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrev, prevBtn);
            newPrev.addEventListener('click', () => this.tourPrev());
        }
        if (nextBtn) {
            const newNext = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNext, nextBtn);
            newNext.addEventListener('click', () => this.tourNext());
        }
        
        this.updateTourIndicator();
    }
    
    updateTourIndicator() {
        const idx = this.tourMode.currentPlanetIndex;
        const planet = this.planets[idx];
        
        // Update planet name
        const nameEl = document.getElementById('tour-planet-name');
        if (nameEl && planet) nameEl.textContent = planet.name;
        
        // Update dots
        const dots = document.querySelectorAll('.tour-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    }
    
    updateTourProgress() {
        const fill = document.getElementById('tour-progress-fill');
        if (fill && this.tourMode.active) {
            const pct = Math.min(100, (this.tourMode.timeAtPlanet / this.tourMode.pauseDuration) * 100);
            fill.style.width = pct + '%';
        }
    }
    
    updateTour(deltaTime) {
        if (!this.tourMode.active) return;
        
        this.tourMode.timeAtPlanet += deltaTime;
        
        // Update progress bar every frame
        this.updateTourProgress();
        
        // Move to next planet after pause duration
        if (this.tourMode.timeAtPlanet >= this.tourMode.pauseDuration) {
            this.tourMode.timeAtPlanet = 0;
            this.tourMode.currentPlanetIndex = (this.tourMode.currentPlanetIndex + 1) % this.planets.length;
            
            const nextPlanet = this.planets[this.tourMode.currentPlanetIndex];
            if (nextPlanet) {
                this.focusOnPlanet(nextPlanet.name, false, true);
                this.updateTourIndicator();
            }
        }
    }
    
    updateTourUI(isActive) {
        // Toggle tour button label
        const tourBtn = document.getElementById('tour-toggle');
        if (tourBtn) {
            if (isActive) {
                tourBtn.classList.add('active');
                tourBtn.querySelector('.toggle-label').textContent = 'Stop Tour';
            } else {
                tourBtn.classList.remove('active');
                tourBtn.querySelector('.toggle-label').textContent = 'Tour';
            }
        }
        
        // Show/hide tour navigation overlay
        const tourNav = document.getElementById('tour-nav');
        if (tourNav) {
            if (isActive) {
                tourNav.classList.remove('hidden');
            } else {
                tourNav.classList.add('hidden');
            }
        }
        
        // Reset progress bar when stopping
        if (!isActive) {
            const fill = document.getElementById('tour-progress-fill');
            if (fill) fill.style.width = '0%';
        }
    }
    
    releasePlanetFocus() {
        if (this.focusedPlanet) {
            console.log(`Released focus from ${this.focusedPlanet.name}`);
            this.focusedPlanet = null;
            this.controls.enabled = true; // Re-enable orbit controls
            
            // Hide planet facts panel
            this.hidePlanetFacts();
            
            this.saveSettings();
            
            // Update mobile UI if available
            if (this.updateMobileUI) {
                this.updateMobileUI();
            }
        }
    }
    
    updateCameraForFocusedPlanet() {
        if (this.focusedPlanet && !this.cameraTransition.active) {
            const planet = this.focusedPlanet;
            const planetPosition = planet.mesh.position.clone();
            
            // Calculate camera position relative to planet
            const cameraOffset = new THREE.Vector3(
                this.cameraFollowDistance, 
                this.cameraFollowDistance * 0.5, 
                this.cameraFollowDistance
            );
            
            const targetPosition = planetPosition.clone().add(cameraOffset);
            
            // Smooth follow using lerp
            this.camera.position.lerp(targetPosition, 0.05);
            
            // Smooth look-at
            const currentLookAt = new THREE.Vector3();
            this.camera.getWorldDirection(currentLookAt);
            currentLookAt.multiplyScalar(10).add(this.camera.position);
            currentLookAt.lerp(planetPosition, 0.08);
            this.camera.lookAt(currentLookAt);
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
        
        // Calculate delta time
        const now = performance.now();
        const deltaTime = (now - (this.lastFrameTime || now)) / 1000;
        this.lastFrameTime = now;
        
        // Handle keyboard movement
        this.handleMovement();
        
        // Update camera transition
        this.updateCameraTransition(deltaTime);
        
        // Update tour mode
        this.updateTour(deltaTime);
        
        // Rotate sun and add solar activity
        if (this.sun) {
            this.sun.rotation.y += 0.00175 * this.speedMultiplier;
            
            // Subtle solar activity simulation - pulse the corona glow
            const time = Date.now() * 0.001;
            const pulseIntensity = 0.12 + Math.sin(time * 0.5) * 0.04 + Math.sin(time * 0.7) * 0.02;
            if (this.sun.children[0]) {
                this.sun.children[0].material.opacity = pulseIntensity;
            }
            if (this.sun.children[1]) {
                this.sun.children[1].material.opacity = pulseIntensity * 0.6;
            }
        }
        
        // Animate planets
        this.planets.forEach(planet => {
            // Orbital motion
            planet.angle += planet.speed * this.speedMultiplier;
            planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
            
            // Planet rotation
            planet.mesh.rotation.y += planet.rotationSpeed * this.speedMultiplier;
            
            // Rotate Earth's cloud layer independently (slightly faster)
            if (planet.name === 'Earth' && planet.mesh.userData.clouds) {
                planet.mesh.userData.clouds.rotation.y += planet.rotationSpeed * 1.3 * this.speedMultiplier;
            }
            
            // Update Saturn's rings position
            if (planet.name === 'Saturn' && this.saturnRings) {
                this.saturnRings.position.copy(planet.mesh.position);
                
                // Only rotate around Y axis, preserve original X and Z tilt
                this.saturnRings.rotation.y += 0.001 * this.speedMultiplier; // Slow ring rotation
                this.saturnRings.rotation.x = this.saturnRingsOriginalTiltX; // Maintain original X tilt
                this.saturnRings.rotation.z = this.saturnRingsOriginalTiltZ; // Maintain original Z tilt
            }
            
            // Update Uranus's rings position
            if (planet.name === 'Uranus' && this.uranusRings) {
                this.uranusRings.position.copy(planet.mesh.position);
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
        
        // Animate asteroid belt
        this.animateAsteroidBelt();
        
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
