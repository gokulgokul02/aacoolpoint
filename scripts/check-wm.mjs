import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

global.self = global;
global.window = global;

const loader = new GLTFLoader();

async function checkWM() {
  const data = fs.readFileSync('public/models/washing_machine.glb');
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  loader.parse(arrayBuffer, '', (gltf) => {
    const scene = gltf.scene;
    scene.traverse((child) => {
      if (child.isMesh && (
        child.name.toLowerCase().includes('panel') ||
        child.name.toLowerCase().includes('knob') ||
        child.name.toLowerCase().includes('top') ||
        child.name.toLowerCase().includes('bottom') ||
        child.name.toLowerCase().includes('leg') ||
        child.name.toLowerCase().includes('foot') ||
        child.name.toLowerCase().includes('feet') ||
        child.name.toLowerCase().includes('dispenser')
      )) {
        const b = new THREE.Box3().setFromObject(child);
        console.log(`Mesh: ${child.name}`);
        console.log(`  center: [${((b.min.x+b.max.x)/2).toFixed(3)}, ${((b.min.y+b.max.y)/2).toFixed(3)}, ${((b.min.z+b.max.z)/2).toFixed(3)}]`);
      }
    });
  });
}

checkWM();

