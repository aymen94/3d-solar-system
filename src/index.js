import {
  PerspectiveCamera,
  Scene,
  Clock,
  DirectionalLight,
  Mesh,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  Vector3,
  TextureLoader,
  PointsMaterial,
  Points,
  Float32BufferAttribute,
  RingGeometry,
  Color,
  MeshStandardMaterial,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  Raycaster,
  Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

import sunTexture from "./textures/2k_sun.jpg";
import planetData from "./planetData";

import './styles.css';

let camera, scene, renderer, controls, clock, gui, sun;
let dateDiv, raycaster, mouse, infoDiv, targetPlanet = null;
console.log(planetData);

const params = {
  orbitSpeed: 0.5,
  starDensity: 99000,
};

init();

function init() {
  clock = new Clock();
  const textureLoader = new TextureLoader();

  camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(30, 30, 30);

  scene = new Scene();

  scene.background = new Color(0x000000);

  const sunGeometry = new SphereGeometry(3, 32, 32);
  const sunMaterial = new MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
  });
  sun = new Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 0, 0);
  scene.add(sun);

  const sunlight = new DirectionalLight(0xffffff, 2);
  sunlight.position.set(5, 5, 5);
  scene.add(sunlight);

  raycaster = new Raycaster();
  mouse = new Vector2();

  planetData.forEach((planet) => {
    const planetGeometry = new SphereGeometry(0.5, 32, 32);
    const planetMaterial = new MeshStandardMaterial({
      map: textureLoader.load(planet.texture),
    });
    const planetMesh = new Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(planet.distance, 0, 0);
    planetMesh.name = planet.name;
    scene.add(planetMesh);

    const orbitGeometry = new BufferGeometry().setFromPoints(getOrbitPoints(planet.distance));
    const orbitMaterial = new LineBasicMaterial({ color: 0xffffff });
    const orbitLine = new Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    planet.mesh = planetMesh;
    planet.angle = Math.random() * Math.PI * 2;
    planet.textureLoader = textureLoader;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "Bold 18px Arial";
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.fillText(planet.name, 0, 24);
    const texture = new CanvasTexture(canvas);
    const spriteMaterial = new SpriteMaterial({ map: texture });
    const sprite = new Sprite(spriteMaterial);
    sprite.scale.set(1.5, 0.75, 1);
    sprite.position.set(planet.distance + 1, 1.5, 0);
    scene.add(sprite);
    planet.label = sprite;
    sprite.visible = false;

    if (planet.name === "Earth") {
      const moonGeometry = new SphereGeometry(0.1, 32, 32);
      const moonMaterial = new MeshBasicMaterial({ color: 0xaaaaaa });
      const moon = new Mesh(moonGeometry, moonMaterial);
      moon.position.set(planet.distance + 1, 0, 0);
      scene.add(moon);
      planet.moon = moon;
      planet.moonAngle = Math.random() * Math.PI * 2;
    }

    if (planet.hasRings) {
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
  starGeometry.setAttribute("position", new Float32BufferAttribute(starVertices, 3));
  const starMaterial = new PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    opacity: 0.9,
  });
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
  gui.add(params, "orbitSpeed", 0.1, 2.0).name("Orbit Speed");
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("click", onMouseClick);

  const planetButtonsDiv = document.createElement("div");
  planetButtonsDiv.className = "planet-buttons";
  document.body.appendChild(planetButtonsDiv);

  planetData.forEach((planet) => {
    const button = document.createElement("button");
    button.textContent = planet.name;
    button.className = "planet-button";
    button.addEventListener("click", () => {
      infoDiv.style.display = "block";
      infoDiv.innerHTML = `
                <h2>${planet.name}</h2>
                <p><strong>Year Length:</strong> ${planet.yearLength} days</p>
                <p><strong>gravity:</strong> ${planet.gravity}</p>
                <p><strong>satellite:</strong> ${planet.satellite}</p>
                <p>${planet.description}</p>
      `;
      targetPlanet = planet;
    });
    planetButtonsDiv.appendChild(button);
  });

  const sunButton = document.createElement("button");
  sunButton.textContent = "Sun";
  sunButton.className = "sun-button";
  sunButton.addEventListener("click", () => {
    infoDiv.style.display = "block";
    infoDiv.innerHTML = `
              <h2>Sun</h2>
              <p>The Sun is the star at the center of the Solar System.</p>
              <p>It is a nearly perfect sphere of hot plasma, and it provides light and heat to the planets in the solar system.</p>
    `;
    targetPlanet = { mesh: sun };
  });
  planetButtonsDiv.appendChild(sunButton);

  const freeMovementButton = document.createElement("button");
  freeMovementButton.textContent = "Free Movement";
  freeMovementButton.className = "free-movement-button";
  freeMovementButton.addEventListener("click", () => {
    infoDiv.style.display = "none";
    targetPlanet = null; 
  });
  planetButtonsDiv.appendChild(freeMovementButton);

  dateDiv = document.createElement("div");
  dateDiv.className = "date-div";
  document.body.appendChild(dateDiv);

  infoDiv = document.createElement("div");
  infoDiv.className = "info-div";
  infoDiv.style.display = "none";
  document.body.appendChild(infoDiv);
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

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    const planet = planetData.find((p) => p.mesh === clickedObject);
    if (planet) {
      infoDiv.style.display = "block";
      infoDiv.innerHTML = `
                <h2>${planet.name}</h2>
                <p><strong>Year Length:</strong> ${planet.yearLength} days</p>
                <p><strong>gravity:</strong> ${planet.gravity}</p>
                <p><strong>satellite:</strong> ${planet.satellite}</p>
                <p>${planet.description}</p>
     `;

     targetPlanet = planet; 
    }
  } else {
    infoDiv.style.display = "none";
    targetPlanet = null;  
  }
}

function animate() {
  const delta = clock.getDelta();
  const yearLength = 365;
  const dayIncrement = (params.orbitSpeed * delta) / (2 * Math.PI);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  planetData.forEach((planet) => {
    if (planet.mesh) {
      const eccentricity = 0.0167;
      const distanceFactor = 1 + eccentricity * Math.cos(planet.angle);
      const currentDistance = planet.distance * distanceFactor;

      planet.angle += planet.speed * params.orbitSpeed * delta;
      planet.mesh.position.set(Math.cos(planet.angle) * currentDistance, 0, Math.sin(planet.angle) * currentDistance);
      planet.mesh.rotation.y += delta * 0.5;

      if (planet.hasRings) {
        planet.rings.position.set(Math.cos(planet.angle) * currentDistance, 0, Math.sin(planet.angle) * currentDistance);
      }
    }

    if (planet.name === "Earth" && planet.moon) {
      planet.moonAngle += planet.speed * params.orbitSpeed * 2 * delta;
      planet.moon.position.set(Math.cos(planet.moonAngle) * 1 + planet.mesh.position.x, 0, Math.sin(planet.moonAngle) * 1 + planet.mesh.position.z);
    }

    if (intersects.length > 0 && intersects[0].object === planet.mesh) {
      planet.label.visible = true;
    } else {
      planet.label.visible = false;
    }
  });

  if (targetPlanet) {
    const targetPosition = new Vector3().copy(targetPlanet.mesh.position);
    const desiredCameraPosition = targetPosition.clone().add(new Vector3(5, 5, 5));
    camera.position.lerp(desiredCameraPosition, 0.02); 
    controls.target.copy(targetPlanet.mesh.position);
    controls.update();
  }

  const daysPassed = Math.floor((clock.getElapsedTime() * params.orbitSpeed) % yearLength);
  dateDiv.textContent = `Day: ${daysPassed + 1} of 365`;

  controls.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
