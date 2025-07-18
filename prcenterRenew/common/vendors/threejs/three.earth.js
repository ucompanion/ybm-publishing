import * as THREE from '/prcenterRenew/common/vendors/threejs/three.module.min.js';

window.THREE = THREE;
const $appELE = document.querySelector('.earth-3d');
const w = $appELE.clientWidth;
const h = $appELE.clientHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(w, h);
$appELE.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(3.052,12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/prcenterRenew/common/vendors/threejs/textures/earthmap.jpg"),
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2.5);
scene.add(hemiLight);

function animate(){
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
    renderer.setSize($appELE.clientWidth, $appELE.clientHeight);
}
window.addEventListener('resize', handleWindowResize, false);