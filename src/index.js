import { PerspectiveCamera, Scene, Clock, DirectionalLight, Mesh, WebGLRenderer, SphereGeometry, MeshBasicMaterial, LineBasicMaterial, BufferGeometry, Line, Vector3, TextureLoader, PointsMaterial, Points, Float32BufferAttribute, RingGeometry, Group, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

import sunTexture from './textures/2k_sun.jpg';
import earthDay from './textures/earth_day_4096.jpg';
import mercuryTexture from './textures/2k_mercury.jpg';
import venusTexture from './textures/2k_venus.jpg';
import marsTexture from './textures/2k_mars.jpg';
import jupiterTexture from './textures/2k_jupiter.jpg';
import saturnTexture from './textures/2k_saturn.jpg';
import uranusTexture from './textures/2k_uranus.jpg';
import neptuneTexture from './textures/2k_neptune.jpg';

let camera, scene, renderer, controls, clock, gui;
let planetData;

const params = {
    orbitSpeed: 0.5,
    starDensity: 99000  
};

init();

function init() {
    clock = new Clock();
    const textureLoader = new TextureLoader();

    camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(10, 10, 10);

    scene = new Scene();

    scene.background = new Color(0x000000);

    const sunGeometry = new SphereGeometry(3, 32, 32);
    const sunMaterial = new MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
    const sun = new Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);
    scene.add(sun);

    const sunlight = new DirectionalLight(0xffffff, 2);
    sunlight.position.set(5, 5, 5);
    scene.add(sunlight);

    planetData = [
        { name: 'Earth', distance: 8, texture: earthDay, speed: 0.02 },
        { name: 'Mercury', distance: 5, texture: mercuryTexture, speed: 0.04 },
        { name: 'Venus', distance: 6.5, texture: venusTexture, speed: 0.015 },
        { name: 'Mars', distance: 10, texture: marsTexture, speed: 0.01 },
        { name: 'Jupiter', distance: 14, texture: jupiterTexture, speed: 0.008 },
        { name: 'Saturn', distance: 18, texture: saturnTexture, speed: 0.007 },
        { name: 'Uranus', distance: 22, texture: uranusTexture, speed: 0.005 },
        { name: 'Neptune', distance: 26, texture: neptuneTexture, speed: 0.004 },
    ];

    planetData.forEach((planet) => {
        const planetGeometry = new SphereGeometry(0.5, 32, 32);
        const planetMaterial = new MeshBasicMaterial({ map: textureLoader.load(planet.texture) });
        const planetMesh = new Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(planet.distance, 0, 0);
        scene.add(planetMesh);

        const orbitGeometry = new BufferGeometry().setFromPoints(getOrbitPoints(planet.distance));
        const orbitMaterial = new LineBasicMaterial({ color: 0xffffff });
        const orbitLine = new Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);

        planet.mesh = planetMesh;
        planet.angle = Math.random() * Math.PI * 2;

        if (planet.name === 'Earth') {
            const moonGeometry = new SphereGeometry(0.1, 32, 32);
            const moonMaterial = new MeshBasicMaterial({ color: 0xaaaaaa });
            const moon = new Mesh(moonGeometry, moonMaterial);
            moon.position.set(planet.distance + 1, 0, 0);
            scene.add(moon);
            planet.moon = moon;
            planet.moonAngle = Math.random() * Math.PI * 2;
        }

        if (planet.name === 'Saturn') {
            const ringGeometry = new RingGeometry(0.6, 1.2, 64);
            const ringMaterial = new MeshBasicMaterial({ color: 0xb49a77, side: 2 });
            const rings = new Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = Math.PI / 2;
            rings.position.set(planet.distance, 0, 0);
            scene.add(rings);
            planet.rings = rings;
        }
    });

    const starGeometry = new BufferGeometry();
    const starCount = params.starDensity;
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 300;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
    const starMaterial = new PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.9 });
    const stars = new Points(starGeometry, starMaterial);
    scene.add(stars);

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    gui = new GUI();
    gui.add(params, 'orbitSpeed', 0.1, 2.0).name('Orbit Speed');
    window.addEventListener('resize', onWindowResize);

    const controllerModelFactory = new XRControllerModelFactory();
    const controller1 = renderer.xr.getController(0);
    scene.add(controller1);
    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);
}

function getOrbitPoints(radius) {
    const points = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return points;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    const delta = clock.getDelta();

    planetData.forEach((planet) => {
        if (planet.mesh) {
            planet.angle += planet.speed * params.orbitSpeed * delta;
            planet.mesh.position.set(
                Math.cos(planet.angle) * planet.distance,
                0,
                Math.sin(planet.angle) * planet.distance
            );
            planet.mesh.rotation.y += delta * 0.5;
        }

        if (planet.name === 'Earth' && planet.moon) {
            planet.moonAngle += planet.speed * params.orbitSpeed * 2 * delta;
            planet.moon.position.set(
                Math.cos(planet.moonAngle) * 1 + planet.mesh.position.x,
                0,
                Math.sin(planet.moonAngle) * 1 + planet.mesh.position.z
            );
        }

        if (planet.name === 'Saturn' && planet.rings) {
            planet.rings.position.set(
                Math.cos(planet.angle) * planet.distance,
                0,
                Math.sin(planet.angle) * planet.distance
            );
        }
    });

    controls.update();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
