import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//DOM
const bgAudio = document.querySelector('.bgAudio');
const curtain = document.querySelector('.curtain');
const info = document.querySelector('.info');
const percent = document.querySelector('.percent');
const progress = document.querySelector('.progress');

//Loading Manager
const loadingManager = new THREE.LoadingManager(
    () => {
        gsap.to(curtain, { opacity: 0, duration: 3, delay: 1 });
        gsap.to(info, { opacity: 0, duration: 1 });
        setTimeout(() => {
            bgAudio.play();
        }, 2000);
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
        let percentageValue = Math.round((itemsLoaded / itemsTotal) * 100);
        percent.innerHTML = `${percentageValue}%`;
        progress.innerHTML = itemUrl;
    }
);

//Canvas
const canvas = document.querySelector('.webgl');

//Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

//Scene
const scene = new THREE.Scene();

//Models
const gltfLoader = new GLTFLoader(loadingManager);

gltfLoader.load(
    './models/garage/scene.gltf',
    (gltf) => {
        gltf.scene.scale.set(0.005, 0.005, 0.005);
        gltf.scene.position.set(2, 0, 1);
        gltf.scene.traverse((node) => {
            if (node.isMesh) { node.receiveShadow = true; }
        });
        scene.add(gltf.scene);
    }
);

let mixer = null;

gltfLoader.load(
    './models/mclaren_p1/scene.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        gltf.scene.scale.set(0.0042, 0.0042, 0.0042);
        gltf.scene.position.set(-0.35, 0, 0.4);
        gltf.scene.rotation.y = 3 * Math.PI / 4;
        gltf.scene.traverse((node) => {
            if (node.isMesh) { node.castShadow = true; }
        });
        scene.add(gltf.scene);
    }
);


//Textures


//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xFBFAB2, 4, 10, 2);
pointLight1.position.set(-0.35, 1.175, 0.375);
pointLight1.castShadow = true;
pointLight1.shadow.mapSize.width = 256;
pointLight1.shadow.mapSize.height = 256;
pointLight1.shadow.radius = 10;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xFBFAB2, 4, 10, 2);
pointLight2.position.set(-0.35, 1.1, -1.95);
pointLight2.castShadow = true;
pointLight2.shadow.mapSize.width = 256;
pointLight2.shadow.mapSize.height = 256;
pointLight2.shadow.radius = 10;
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xFBFAB2, 4, 10, 2);
pointLight3.position.set(-0.35, 1.175, 1.45);
pointLight3.castShadow = true;
pointLight3.shadow.mapSize.width = 256;
pointLight3.shadow.mapSize.height = 256;
pointLight3.shadow.radius = 10;
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight(0xFBFAB2, 4, 10, 2);
pointLight4.position.set(-0.35, 1.2, -3.8);
scene.add(pointLight4);




//Materials
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

//Objects



//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 2.4;
camera.position.y = 0.75;
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;

//Controls
const controls = new OrbitControls(camera, canvas);
controls.target = new THREE.Vector3(-0.35, 0, 0.4);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 3.27;
controls.maxPolarAngle = Math.PI / 2.1;
controls.autoRotate = true;

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    stats.begin();

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    if (mixer !== null) {
        mixer.update(deltaTime);
    }

    //Update controls
    controls.update();

    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    stats.end();
};

tick();

//Responsive Resize
window.addEventListener('resize', () => {
    //Update Canvas size
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update Camera aspect ratio
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Fullscreen
// window.addEventListener('dblclick', () => {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) {
//             canvas.requestFullscreen();
//         } else if (canvas.webkitRequestFullscreen) {
//             canvas.webkitRequestFullscreen();
//         }
//     } else {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         }
//     }
// });