import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

global.self = global;
global.window = global;

const loader = new GLTFLoader();

async function checkModel(file) {
  console.log('==============================');
  console.log('FILE:', file);
  const data = fs.readFileSync(file);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  await new Promise((resolve) => {
    loader.parse(arrayBuffer, '', (gltf) => {
      const scene = gltf.scene;
      scene.traverse((child) => {
        if (child.isMesh && (
          child.name.toLowerCase().includes('top') ||
          child.name.toLowerCase().includes('door') ||
          child.name.toLowerCase().includes('panel') ||
          child.name.toLowerCase().includes('mount') ||
          child.name.toLowerCase().includes('lip') ||
          child.name.toLowerCase().includes('hook') ||
          child.name.toLowerCase().includes('upper') ||
          child.name.toLowerCase().includes('lower') ||
          child.name.toLowerCase().includes('fascia') ||
          child.name.toLowerCase().includes('display') ||
          child.name.toLowerCase().includes('drum')
        )) {
          const b = new THREE.Box3().setFromObject(child);
          console.log(`Mesh: ${child.name}`);
          console.log(`  center: [${((b.min.x+b.max.x)/2).toFixed(3)}, ${((b.min.y+b.max.y)/2).toFixed(3)}, ${((b.min.z+b.max.z)/2).toFixed(3)}]`);
          console.log(`  box min: [${b.min.x.toFixed(3)}, ${b.min.y.toFixed(3)}, ${b.min.z.toFixed(3)}]`);
          console.log(`  box max: [${b.max.x.toFixed(3)}, ${b.max.y.toFixed(3)}, ${b.max.z.toFixed(3)}]`);
        }
      });
      resolve();
    });
  });
}

async function run() {
  await checkModel('public/models/ac.glb');
  await checkModel('public/models/refrigerator.glb');
  await checkModel('public/models/washing_machine.glb');
}

run();

