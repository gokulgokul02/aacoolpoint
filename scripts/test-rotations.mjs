import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

global.self = global;
global.window = global;

const loader = new GLTFLoader();

async function testOrientation(name, file, scale) {
  const data = fs.readFileSync(file);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  loader.parse(arrayBuffer, '', (gltf) => {
    const root = new THREE.Group();
    const modelGroup = new THREE.Group();
    modelGroup.rotation.x = -Math.PI / 2;
    modelGroup.scale.setScalar(scale);
    modelGroup.add(gltf.scene);

    // Box calculation
    const box = new THREE.Box3().setFromObject(modelGroup);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    console.log(`=== ${name} ===`);
    console.log(`Size (W x H x D): [Width: ${size.x.toFixed(2)}, Height: ${size.y.toFixed(2)}, Depth: ${size.z.toFixed(2)}]`);
    console.log(`Min: [${box.min.x.toFixed(2)}, ${box.min.y.toFixed(2)}, ${box.min.z.toFixed(2)}]`);
    console.log(`Max: [${box.max.x.toFixed(2)}, ${box.max.y.toFixed(2)}, ${box.max.z.toFixed(2)}]`);

    // Center offset
    modelGroup.position.sub(center);
    const centeredBox = new THREE.Box3().setFromObject(modelGroup);
    console.log(`Centered Y min: ${centeredBox.min.y.toFixed(2)}, Y max: ${centeredBox.max.y.toFixed(2)}`);
  });
}

async function run() {
  await testOrientation('AC', 'public/models/ac.glb', 2.6);
  await testOrientation('Refrigerator', 'public/models/refrigerator.glb', 1.45);
  await testOrientation('Washing Machine', 'public/models/washing_machine.glb', 2.1);
}

run();

