import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Polyfill self/window/atob if needed
global.self = global;
global.window = global;

const files = [
  'public/models/ac.glb',
  'public/models/refrigerator.glb',
  'public/models/washing_machine.glb'
];

async function inspect() {
  const loader = new GLTFLoader();

  for (const file of files) {
    console.log('--- Inspecting:', file);
    const data = fs.readFileSync(file);
    const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

    await new Promise((resolve, reject) => {
      loader.parse(arrayBuffer, '', (gltf) => {
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        console.log(`Min: [${box.min.x.toFixed(3)}, ${box.min.y.toFixed(3)}, ${box.min.z.toFixed(3)}]`);
        console.log(`Max: [${box.max.x.toFixed(3)}, ${box.max.y.toFixed(3)}, ${box.max.z.toFixed(3)}]`);
        console.log(`Size: [${size.x.toFixed(3)}, ${size.y.toFixed(3)}, ${size.z.toFixed(3)}]`);
        console.log(`Center: [${center.x.toFixed(3)}, ${center.y.toFixed(3)}, ${center.z.toFixed(3)}]`);
        
        let meshes = [];
        root.traverse((child) => {
          if (child.isMesh) {
            meshes.push({
              name: child.name,
              position: [child.position.x, child.position.y, child.position.z],
              rotation: [child.rotation.x, child.rotation.y, child.rotation.z],
              scale: [child.scale.x, child.scale.y, child.scale.z]
            });
          }
        });
        console.log(`Mesh count: ${meshes.length}`);
        if (meshes.length > 0) {
          console.log('First 3 meshes:', meshes.slice(0, 3));
          console.log('Last 2 meshes:', meshes.slice(-2));
        }
        resolve();
      }, reject);
    });
  }
}

inspect().catch(console.error);

