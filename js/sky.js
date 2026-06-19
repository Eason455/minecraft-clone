// ============================================================
// Sky, sun, moon, and day/night cycle
// ============================================================

import * as THREE from 'three';
import { DAY_LENGTH } from './constants.js';

class SkyManager {
  constructor(scene) {
    this.scene = scene;
    this.time = 0.3; // 0-1, 0=dawn, 0.25=noon, 0.5=dusk, 0.75=midnight
    this.dayLength = DAY_LENGTH;
    this.elapsed = 0.3 * DAY_LENGTH; // start at late morning

    // Sky gradient (using scene background color)
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Sun
    const sunGeo = new THREE.SphereGeometry(20, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff80 });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.sun.renderOrder = -1;
    this.sun.material.depthTest = false;
    this.sun.material.depthWrite = false;
    scene.add(this.sun);

    // Moon
    const moonGeo = new THREE.SphereGeometry(15, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xeeeeff });
    this.moon = new THREE.Mesh(moonGeo, moonMat);
    this.moon.renderOrder = -1;
    this.moon.material.depthTest = false;
    this.moon.material.depthWrite = false;
    scene.add(this.moon);

    // Ambient light (changes with time)
    this.ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(this.ambientLight);

    // Directional light (sun)
    this.sunLight = new THREE.DirectionalLight(0xfff0d0, 1.2);
    this.sunLight.position.set(100, 100, 100);
    scene.add(this.sunLight);

    // Hemisphere light (sky/ground)
    this.hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x362907, 0.5);
    scene.add(this.hemiLight);

    // Set initial state
    this.time = 0.3; // start at late morning
  }

  update(deltaTime) {
    this.elapsed += deltaTime;
    this.time = (this.elapsed / this.dayLength) % 1.0;

    const angle = this.time * Math.PI * 2; // full circle

    // Sun and moon orbit
    const sunY = Math.sin(angle) * 150;
    const sunX = Math.cos(angle) * 150;
    this.sun.position.set(sunX, sunY, 0);

    const moonAngle = angle + Math.PI;
    const moonY = Math.sin(moonAngle) * 150;
    const moonX = Math.cos(moonAngle) * 150;
    this.moon.position.set(moonX, moonY, 0);

    // Sun visibility (only above horizon)
    this.sun.visible = sunY > -15;

    // Moon visibility (only above horizon, opposite of sun)
    this.moon.visible = moonY > -15;

    // Lighting based on time of day
    let sunIntensity, ambientIntensity, hemiIntensity;
    let skyColor, fogColor;

    if (this.time < 0.25) {
      // Dawn to noon
      const t = this.time / 0.25;
      sunIntensity = 0.4 + t * 0.8;
      ambientIntensity = 0.3 + t * 0.3;
      hemiIntensity = 0.3 + t * 0.3;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x1a1a3a), new THREE.Color(0x87CEEB), t
      );
    } else if (this.time < 0.5) {
      // Noon to dusk
      const t = (this.time - 0.25) / 0.25;
      sunIntensity = 1.2 - t * 0.6;
      ambientIntensity = 0.6 - t * 0.2;
      hemiIntensity = 0.6 - t * 0.2;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x87CEEB), new THREE.Color(0xff8c42), t
      );
    } else if (this.time < 0.75) {
      // Dusk to midnight
      const t = (this.time - 0.5) / 0.25;
      sunIntensity = 0.6 - t * 0.6;
      ambientIntensity = 0.4 - t * 0.25;
      hemiIntensity = 0.4 - t * 0.25;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0xff8c42), new THREE.Color(0x0a0a1e), t
      );
    } else {
      // Midnight to dawn
      const t = (this.time - 0.75) / 0.25;
      sunIntensity = t * 0.4;
      ambientIntensity = 0.15 + t * 0.15;
      hemiIntensity = 0.15 + t * 0.15;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x0a0a1e), new THREE.Color(0x1a1a3a), t
      );
    }

    // Apply lighting
    this.sunLight.intensity = Math.max(0, sunIntensity);
    this.ambientLight.intensity = Math.max(0.1, ambientIntensity);
    this.hemiLight.intensity = Math.max(0.1, hemiIntensity);

    // Sky/fog color
    this.scene.background = skyColor;
    this.scene.fog.color.copy(skyColor);

    // Sunlight direction
    this.sunLight.position.copy(this.sun.position);
  }

  // Get current time as formatted string
  getTimeString() {
    const totalMinutes = this.time * 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}

export default SkyManager;
