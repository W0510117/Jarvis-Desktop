// ==========================
// SCENE SETUP
// ==========================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ==========================
// SPHERE
// ==========================
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  emissive: 0x008888,
  roughness: 0.3,
  metalness: 0.6,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// ==========================
// LIGHTING
// ==========================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// ==========================
// PULSE VARIABLES
// ==========================
let clock = new THREE.Clock();
const baseScale = 1;
const pulseStrength = 0.2;   // how strong the pulse is
const pulseSpeed = 1;        // how fast it pulses

// ==========================
// ANIMATION LOOP
// ==========================
function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // Sine wave pulsing
  const pulse = baseScale + Math.sin(time * pulseSpeed) * pulseStrength;
  sphere.scale.set(pulse, pulse, pulse);

  renderer.render(scene, camera);
}

animate();

// ==========================
// HANDLE RESIZE
// ==========================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
