import * as THREE from 'three';
import { Machine3DType } from './DigitalTwin3D';

export interface Machine3DMaterials {
  darkCastIronMat: THREE.Material;
  machinedFlangeMat: THREE.Material;
  translucentHoodMat: THREE.Material;
  alloyShaftMat: THREE.Material;
  gearCarburizedMat: THREE.Material;
  bearingBrassMat: THREE.Material;
  oilBathMat: THREE.Material;
  aerospaceGoldMat: THREE.Material;
  carbonFiberMat: THREE.Material;
  glowingLaserMat: THREE.Material;
  glowingMeltMat: THREE.Material;
}

export interface Machine3DGroups {
  lowerHousingGroup: THREE.Group;
  upperCoverGroup: THREE.Group;
  frontWallGroup: THREE.Group;
  inputShaftGroup: THREE.Group;
  intermediateShaftGroup: THREE.Group;
  outputShaftGroup: THREE.Group;
  bearingsGroup: THREE.Group;
  gearsGroup: THREE.Group;
  oilSumpGroup: THREE.Group;
}

export interface RotatingMeshItem {
  obj: THREE.Object3D;
  axis: 'x' | 'y' | 'z';
  speed: number;
}

export interface BuildMachine3DParams {
  type: Machine3DType;
  groups: Machine3DGroups;
  materials: Machine3DMaterials;
  rotatingMeshes: RotatingMeshItem[];
  dimensions: {
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    inShaftRadius: number;
    outShaftRadius: number;
  };
}

/**
 * Builds distinct, authentic 3D Digital Twin physical geometry for each machine.
 */
export function buildMachine3DModel({
  type,
  groups,
  materials: m,
  rotatingMeshes,
  dimensions: { scaleX, scaleY, scaleZ, inShaftRadius, outShaftRadius },
}: BuildMachine3DParams) {
  // Clear any existing children from groups
  Object.values(groups).forEach((g) => g.clear());

  switch (type) {
    case 'turbofan_engine':
      buildTurbofanEngine(groups, m, rotatingMeshes);
      break;
    case 'nasa_ims_rig':
      buildNasaImsRig(groups, m, rotatingMeshes);
      break;
    case 'isaac_robot':
      buildIsaacRobot(groups, m, rotatingMeshes);
      break;
    case 'iss_refab':
      buildIssRefabricator(groups, m, rotatingMeshes);
      break;
    case 'ebf3_vacuum':
      buildNasaEbf3(groups, m, rotatingMeshes);
      break;
    case 'cnc_mill':
      buildCncMilling(groups, m, rotatingMeshes);
      break;
    case 'cnc_lathe':
      buildCncLathe(groups, m, rotatingMeshes);
      break;
    case 'vmc_center':
      buildVmcCenter(groups, m, rotatingMeshes);
      break;
    case 'pump':
      buildCentrifugalPump(groups, m, rotatingMeshes);
      break;
    case 'motor':
      buildIndustrialMotor(groups, m, rotatingMeshes);
      break;
    default:
      buildHelicalGearbox(groups, m, rotatingMeshes, scaleX, scaleY, scaleZ, inShaftRadius, outShaftRadius);
      break;
  }
}

// ---------------------------------------------------------------------------
// 0. NASA IMS Rexnord ZA-2115 Bearing Rig
// 4-Bearing Test-to-Failure Rig with 6000 lbs Spring Loading & AC Belt Drive
// ---------------------------------------------------------------------------
function buildNasaImsRig(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // Heavy Steel Machine Bed
  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.16, 1.3), m.darkCastIronMat);
  bed.position.set(0, -0.78, 0);
  g.lowerHousingGroup.add(bed);

  // Dual Machined T-Slot Mounting Rails
  const railFront = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.04, 0.09), m.machinedFlangeMat);
  railFront.position.set(0, -0.68, 0.32);
  const railRear = railFront.clone();
  railRear.position.set(0, -0.68, -0.32);
  g.lowerHousingGroup.add(railFront, railRear);

  // Drip Pan / Lube Collection Sump
  const dripPan = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.58), m.machinedFlangeMat);
  dripPan.position.set(0.1, -0.66, 0);
  g.lowerHousingGroup.add(dripPan);

  // AC Drive Motor (Constant 2000 RPM)
  const motorBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.6), m.darkCastIronMat);
  motorBase.position.set(-1.42, -0.66, 0);
  const motorStator = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.62, 32), m.darkCastIronMat);
  motorStator.rotation.z = Math.PI / 2;
  motorStator.position.set(-1.42, -0.32, 0);
  g.lowerHousingGroup.add(motorBase, motorStator);

  // Motor Cooling Ribs
  for (let r = 0; r < 8; r++) {
    const angle = (r / 8) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.06), m.darkCastIronMat);
    rib.position.set(-1.42, -0.32 + Math.cos(angle) * 0.28, Math.sin(angle) * 0.28);
    rib.rotation.x = angle;
    g.lowerHousingGroup.add(rib);
  }

  // Motor Terminal Conduit Box
  const motorJunction = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.18), m.machinedFlangeMat);
  motorJunction.position.set(-1.42, -0.04, 0.12);
  g.upperCoverGroup.add(motorJunction);

  // Motor Output Pulley (lower)
  const motorPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 28), m.gearCarburizedMat);
  motorPulley.rotation.z = Math.PI / 2;
  motorPulley.position.set(-1.05, -0.32, 0);
  g.inputShaftGroup.add(motorPulley);
  rot.push({ obj: motorPulley, axis: 'x', speed: 3.5 });

  // Main Test Rig Shaft Driven Pulley (upper)
  const shaftPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 28), m.gearCarburizedMat);
  shaftPulley.rotation.z = Math.PI / 2;
  shaftPulley.position.set(-1.05, 0.08, 0);
  g.inputShaftGroup.add(shaftPulley);
  rot.push({ obj: shaftPulley, axis: 'x', speed: 3.5 });

  // Dual Rub Belts / V-Belts
  const beltFront = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.03), m.carbonFiberMat);
  beltFront.position.set(-1.07, -0.12, 0.13);
  const beltRear = beltFront.clone();
  beltRear.position.set(-1.03, -0.12, -0.13);
  g.upperCoverGroup.add(beltFront, beltRear);

  // Precision Ground Test Rig Shaft (Length 2.4m, 2000 RPM)
  const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.3, 32), m.alloyShaftMat);
  mainShaft.rotation.z = Math.PI / 2;
  mainShaft.position.set(0.05, 0.08, 0);
  g.inputShaftGroup.add(mainShaft);
  rot.push({ obj: mainShaft, axis: 'x', speed: 3.5 });

  // 4 Rexnord ZA-2115 Pillow Block Bearings:
  // Bearing 1: Drive End (Ch 1) - outer race defect & 79.2°C thermal rise
  // Bearing 2: Inner Support (Ch 2)
  // Bearing 3: Load Support (Ch 3)
  // Bearing 4: Non-Drive End (Ch 4)
  const bearingPositions = [
    { x: -0.72, label: 'Bearing 1 (DE / Ch 1)', isDefect: true },
    { x: -0.22, label: 'Bearing 2 (Ch 2)', isDefect: false },
    { x: 0.32, label: 'Bearing 3 (Ch 3)', isDefect: false },
    { x: 0.82, label: 'Bearing 4 (NDE / Ch 4)', isDefect: false },
  ];

  bearingPositions.forEach((b) => {
    // Pillow block base pedestal
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.34), m.darkCastIronMat);
    pedestal.position.set(b.x, -0.24, 0);
    g.lowerHousingGroup.add(pedestal);

    // Split housing cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.18, 28), m.darkCastIronMat);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(b.x, 0.08, 0);
    g.upperCoverGroup.add(cap);

    // Cap mounting flange bolts
    const bolt1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 12), m.machinedFlangeMat);
    bolt1.position.set(b.x, 0.22, 0.12);
    const bolt2 = bolt1.clone();
    bolt2.position.set(b.x, 0.22, -0.12);
    g.upperCoverGroup.add(bolt1, bolt2);

    // Rexnord ZA-2115 Double Row Rollers (brass cage & rollers)
    const rollerRow1 = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 16, 28), m.bearingBrassMat);
    rollerRow1.rotation.y = Math.PI / 2;
    rollerRow1.position.set(b.x - 0.035, 0.08, 0);
    const rollerRow2 = rollerRow1.clone();
    rollerRow2.position.set(b.x + 0.035, 0.08, 0);
    g.bearingsGroup.add(rollerRow1, rollerRow2);
    rot.push({ obj: rollerRow1, axis: 'x', speed: 3.5 });
    rot.push({ obj: rollerRow2, axis: 'x', speed: 3.5 });

    // PCB 353B33 High Sensitivity Quartz ICP Accelerometer
    const sensorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.075, 20), m.aerospaceGoldMat);
    sensorBody.position.set(b.x, 0.26, 0);
    const sensorBnc = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.035, 16), m.machinedFlangeMat);
    sensorBnc.position.set(b.x, 0.31, 0);
    g.gearsGroup.add(sensorBody, sensorBnc);

    // Thermocouple Probe Junction
    const tcProbe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 12), m.machinedFlangeMat);
    tcProbe.rotation.z = Math.PI / 2;
    tcProbe.position.set(b.x + 0.1, 0.08, 0.11);
    g.upperCoverGroup.add(tcProbe);

    // Bearing 1: Outer race defect indicator with localized amber/orange thermal glow (79.2°C)
    if (b.isDefect) {
      const spallRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.018, 16, 32),
        m.glowingMeltMat
      );
      spallRing.rotation.y = Math.PI / 2;
      spallRing.position.set(b.x, 0.08, 0);
      g.bearingsGroup.add(spallRing);

      // Defect impact zone highlight
      const defectPuck = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.03, 0.08),
        m.glowingMeltMat
      );
      defectPuck.position.set(b.x, 0.2, 0);
      g.bearingsGroup.add(defectPuck);
    }
  });

  // 6000 lbs Radial Spring Loading Mechanism (between Bearing 2 & 3 at x = 0.05)
  // Loading Yoke Straddling Shaft
  const yokeBridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.46), m.machinedFlangeMat);
  yokeBridge.position.set(0.05, 0.28, 0);
  g.upperCoverGroup.add(yokeBridge);

  // Twin Heavy-Duty Compression Coil Springs (6000 lbs radial force)
  for (let s = 0; s < 7; s++) {
    const coilFront = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.016, 12, 24), m.machinedFlangeMat);
    coilFront.rotation.x = Math.PI / 2;
    coilFront.position.set(0.05, 0.48 + s * 0.045, 0.15);
    const coilRear = coilFront.clone();
    coilRear.position.set(0.05, 0.48 + s * 0.045, -0.15);
    g.upperCoverGroup.add(coilFront, coilRear);
  }

  // Top Load Crossbar & Calibrated Spring Tension Screw
  const loadCrossbar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.52), m.darkCastIronMat);
  loadCrossbar.position.set(0.05, 0.82, 0);
  const tensionScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 20), m.alloyShaftMat);
  tensionScrew.position.set(0.05, 0.96, 0);
  const handwheel = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 12, 28), m.darkCastIronMat);
  handwheel.rotation.x = Math.PI / 2;
  handwheel.position.set(0.05, 1.06, 0);
  g.upperCoverGroup.add(loadCrossbar, tensionScrew, handwheel);

  // Force Lubrication Pipe Manifold & Pressure Gauge (3.1 bar)
  const lubeManifold = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 2.0, 16), m.machinedFlangeMat);
  lubeManifold.rotation.z = Math.PI / 2;
  lubeManifold.position.set(0.05, -0.12, 0.26);
  g.oilSumpGroup.add(lubeManifold);

  // Brass Lube Feed Nozzles into each bearing
  bearingPositions.forEach((b) => {
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.26, 12), m.bearingBrassMat);
    nozzle.rotation.x = -Math.PI / 4;
    nozzle.position.set(b.x, -0.02, 0.14);
    g.oilSumpGroup.add(nozzle);
  });

  // Dial Pressure Gauge on lube line (reading 3.1 bar)
  const gaugeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 24), m.machinedFlangeMat);
  gaugeBody.rotation.x = Math.PI / 2;
  gaugeBody.position.set(-0.95, -0.05, 0.28);
  const gaugeFace = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), m.oilBathMat);
  gaugeFace.position.set(-0.95, -0.05, 0.301);
  g.oilSumpGroup.add(gaugeBody, gaugeFace);

  // Sump Reservoir Tank
  const sumpTank = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.24, 0.42), m.oilBathMat);
  sumpTank.position.set(0.05, -0.92, 0);
  g.oilSumpGroup.add(sumpTank);
}

// ---------------------------------------------------------------------------
// 1. NASA ISAAC (Advanced Composites Assembly)
// Multi-axis Automated Fiber Placement (AFP) Robotic Cell
// ---------------------------------------------------------------------------
function buildIsaacRobot(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // Gantry Base & Floor Rails
  const gantryBed = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 1.4), m.darkCastIronMat);
  gantryBed.position.set(0, -0.9, 0);
  g.lowerHousingGroup.add(gantryBed);

  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.04, 0.07), m.machinedFlangeMat);
  rail1.position.set(0, -0.79, 0.45);
  const rail2 = rail1.clone();
  rail2.position.set(0, -0.79, -0.45);
  g.lowerHousingGroup.add(rail1, rail2);

  // Cable drag carrier chain
  const dragChain = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 0.12), m.carbonFiberMat);
  dragChain.position.set(0, -0.75, -0.58);
  g.lowerHousingGroup.add(dragChain);

  // Robot Turret Pedestal (Joint 1)
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.62, 0.38, 32), m.machinedFlangeMat);
  turret.position.set(-0.35, -0.62, 0);
  g.upperCoverGroup.add(turret);

  const waistBracket = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.55), m.carbonFiberMat);
  waistBracket.position.set(-0.35, -0.32, 0);
  g.upperCoverGroup.add(waistBracket);

  // Articulated Shoulder Boom (Joint 2)
  const shoulderBoom = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.25, 0.28), m.carbonFiberMat);
  shoulderBoom.position.set(-0.15, 0.22, 0);
  shoulderBoom.rotation.z = -0.35;
  g.inputShaftGroup.add(shoulderBoom);

  // Elbow Joint (Joint 3)
  const elbowCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.38, 24), m.aerospaceGoldMat);
  elbowCyl.rotation.x = Math.PI / 2;
  elbowCyl.position.set(0.05, 0.72, 0);
  g.inputShaftGroup.add(elbowCyl);

  // Forearm Boom (Joint 4)
  const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.1, 0.22), m.carbonFiberMat);
  forearm.position.set(0.48, 0.45, 0);
  forearm.rotation.z = 0.55;
  g.inputShaftGroup.add(forearm);

  // Harmonic Bearings at Joint Pivots
  const brgRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 16, 32), m.bearingBrassMat);
  brgRing1.rotation.y = Math.PI / 2;
  brgRing1.position.set(-0.35, -0.32, 0.28);
  const brgRing2 = brgRing1.clone();
  brgRing2.position.set(-0.35, -0.32, -0.28);
  g.bearingsGroup.add(brgRing1, brgRing2);

  // Automated Fiber Placement (AFP) End-Effector Head (Joint 5 & 6)
  const wristBlock = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 0.32), m.machinedFlangeMat);
  wristBlock.position.set(0.85, 0.05, 0);
  g.gearsGroup.add(wristBlock);

  // Dual Carbon Fiber Creel Tape Reels
  const reel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.07, 24), m.carbonFiberMat);
  reel1.rotation.x = Math.PI / 2;
  reel1.position.set(0.82, 0.28, 0.24);
  const reel2 = reel1.clone();
  reel2.position.set(0.82, 0.28, -0.24);
  g.gearsGroup.add(reel1, reel2);
  rot.push({ obj: reel1, axis: 'z', speed: 1.5 });
  rot.push({ obj: reel2, axis: 'z', speed: 1.5 });

  // Laser Consolidation Ring (Glowing Cyan Emitter)
  const laserRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 16, 28), m.glowingLaserMat);
  laserRing.rotation.x = Math.PI / 2;
  laserRing.position.set(0.98, -0.06, 0);
  g.gearsGroup.add(laserRing);

  // Compaction Roller
  const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.24, 24), m.alloyShaftMat);
  roller.rotation.z = Math.PI / 2;
  roller.position.set(0.98, -0.18, 0);
  g.gearsGroup.add(roller);
  rot.push({ obj: roller, axis: 'x', speed: 2.2 });

  // Aerospace Fuselage Panel Mandrel on Table
  const mandrel = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.4, 32, 1, false, 0, Math.PI * 0.7), m.darkCastIronMat);
  mandrel.rotation.z = Math.PI / 2;
  mandrel.position.set(1.05, -0.68, 0);
  g.outputShaftGroup.add(mandrel);

  // Placed Composite Tow Strip
  const towStrip = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.22), m.carbonFiberMat);
  towStrip.position.set(0.98, -0.21, 0);
  g.outputShaftGroup.add(towStrip);

  // Cleanroom Lubricant Reservoir
  const lubeBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.22), m.oilBathMat);
  lubeBox.position.set(-1.1, -0.65, 0.38);
  g.oilSumpGroup.add(lubeBox);
}

// ---------------------------------------------------------------------------
// 2. ISS REFABRICATOR (In-Space Manufacturing)
// Zero-G In-Orbit Polymer Recycling & 3D Additive System
// ---------------------------------------------------------------------------
function buildIssRefabricator(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // EXPRESS Rack Locker Outer Enclosure
  const lockerOuter = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 1.4), m.machinedFlangeMat);
  lockerOuter.position.set(0, 0, 0);
  g.lowerHousingGroup.add(lockerOuter);

  // Beveled corner bumpers / aero latches
  const cornerBumper1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 16), m.darkCastIronMat);
  cornerBumper1.position.set(0.92, -0.98, 0.62);
  const cornerBumper2 = cornerBumper1.clone();
  cornerBumper2.position.set(-0.92, -0.98, 0.62);
  const cornerBumper3 = cornerBumper1.clone();
  cornerBumper3.position.set(0.92, -0.98, -0.62);
  const cornerBumper4 = cornerBumper1.clone();
  cornerBumper4.position.set(-0.92, -0.98, -0.62);
  g.lowerHousingGroup.add(cornerBumper1, cornerBumper2, cornerBumper3, cornerBumper4);

  // Upper Recycler Feed Hopper
  const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.22, 0.44, 24), m.alloyShaftMat);
  hopper.position.set(0, 0.72, 0.1);
  g.upperCoverGroup.add(hopper);

  // Recycler Motor & Gearbox Block
  const hopperMotor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.32), m.gearCarburizedMat);
  hopperMotor.position.set(0, 0.98, 0.1);
  g.upperCoverGroup.add(hopperMotor);

  // Transparent Front Door & Observation Window
  const obsWindow = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.35, 0.04), m.translucentHoodMat);
  obsWindow.position.set(0, -0.15, 0.71);
  g.frontWallGroup.add(obsWindow);

  // Dual Stainless Linear Guide Rods
  const rod1 = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 1.3, 16), m.alloyShaftMat);
  rod1.position.set(-0.48, -0.15, 0.15);
  const rod2 = rod1.clone();
  rod2.position.set(0.48, -0.15, 0.15);
  g.inputShaftGroup.add(rod1, rod2);

  // Recycler Feed Screw (Rotating)
  const feedScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.65, 18), m.aerospaceGoldMat);
  feedScrew.position.set(0, 0.48, 0.1);
  g.inputShaftGroup.add(feedScrew);
  rot.push({ obj: feedScrew, axis: 'y', speed: 2.0 });

  // Zero-G Recirculating Linear Bearings
  const brgBlock1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 16), m.bearingBrassMat);
  brgBlock1.position.set(-0.48, 0.08, 0.15);
  const brgBlock2 = brgBlock1.clone();
  brgBlock2.position.set(0.48, 0.08, 0.15);
  g.bearingsGroup.add(brgBlock1, brgBlock2);

  // 3D Extrusion Head & Carriage
  const extruderCarriage = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.36), m.carbonFiberMat);
  extruderCarriage.position.set(0, 0.08, 0.15);
  g.gearsGroup.add(extruderCarriage);

  // Heated Brass Nozzle & Thermal Band
  const nozzleTip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 16), m.glowingMeltMat);
  nozzleTip.rotation.x = Math.PI;
  nozzleTip.position.set(0, -0.14, 0.15);
  g.gearsGroup.add(nozzleTip);

  // Zero-G Vacuum Perforated Build Platform
  const buildPlate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.75), m.machinedFlangeMat);
  buildPlate.position.set(0, -0.68, 0.15);
  g.outputShaftGroup.add(buildPlate);

  // Sealed MoS2 Dry-Film Canister
  const sealedLube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.32, 20), m.oilBathMat);
  sealedLube.position.set(-0.68, -0.55, -0.35);
  g.oilSumpGroup.add(sealedLube);
}

// ---------------------------------------------------------------------------
// 3. NASA EBF3 (Electron Beam Metal Fabrication)
// High-Vacuum 60kV Electron Beam Additive Manufacturing Cell
// ---------------------------------------------------------------------------
function buildNasaEbf3(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // Heavy Machine Table Base
  const baseTable = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.32, 1.8), m.darkCastIronMat);
  baseTable.position.set(0, -0.84, 0);
  g.lowerHousingGroup.add(baseTable);

  // Cylindrical High-Vacuum Chamber Body
  const chamberCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 1.5, 36), m.machinedFlangeMat);
  chamberCyl.position.set(0, 0.05, 0);
  g.lowerHousingGroup.add(chamberCyl);

  // Chamber Flange Rings
  const flangeTop = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.06, 16, 36), m.alloyShaftMat);
  flangeTop.rotation.x = Math.PI / 2;
  flangeTop.position.set(0, 0.78, 0);
  const flangeBottom = flangeTop.clone();
  flangeBottom.position.set(0, -0.68, 0);
  g.lowerHousingGroup.add(flangeTop, flangeBottom);

  // 60kV Electron Beam Gun Column (Extending Upward)
  const gunColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 1.15, 24), m.machinedFlangeMat);
  gunColumn.position.set(0, 1.35, 0);
  g.upperCoverGroup.add(gunColumn);

  // Ceramic High-Voltage Insulators
  const ins1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 24), m.alloyShaftMat);
  ins1.position.set(0, 1.55, 0);
  const ins2 = ins1.clone();
  ins2.position.set(0, 1.72, 0);
  g.upperCoverGroup.add(ins1, ins2);

  // Electromagnetic Deflection Coil Rings (Copper)
  const coil1 = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.042, 16, 28), m.bearingBrassMat);
  coil1.rotation.x = Math.PI / 2;
  coil1.position.set(0, 1.15, 0);
  const coil2 = coil1.clone();
  coil2.position.set(0, 0.95, 0);
  g.upperCoverGroup.add(coil1, coil2);

  // Chamber Front Circular Viewport
  const viewportRim = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 32), m.darkCastIronMat);
  viewportRim.rotation.x = Math.PI / 2;
  viewportRim.position.set(0, 0.08, 1.09);
  const viewportGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.09, 32), m.translucentHoodMat);
  viewportGlass.rotation.x = Math.PI / 2;
  viewportGlass.position.set(0, 0.08, 1.09);
  g.frontWallGroup.add(viewportRim, viewportGlass);

  // Dual Wire-Feed Spool Reels
  const spool1 = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 24), m.machinedFlangeMat);
  spool1.rotation.z = Math.PI / 2;
  spool1.position.set(-0.85, 0.52, 0.45);
  const spool2 = spool1.clone();
  spool2.position.set(0.85, 0.52, 0.45);
  g.inputShaftGroup.add(spool1, spool2);
  rot.push({ obj: spool1, axis: 'x', speed: 1.2 });
  rot.push({ obj: spool2, axis: 'x', speed: 1.2 });

  // Turbomolecular Vacuum Pump Stack (Side)
  const turboPump = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.72, 24), m.darkCastIronMat);
  turboPump.position.set(1.22, -0.32, -0.25);
  g.bearingsGroup.add(turboPump);

  // Glowing Electron Beam Focal Melt Pool
  const meltPool = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 20), m.glowingMeltMat);
  meltPool.position.set(0, -0.15, 0);
  g.gearsGroup.add(meltPool);

  // Water-Cooled Rotary Substrate Table (Inside Chamber)
  const subTable = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.08, 32), m.bearingBrassMat);
  subTable.position.set(0, -0.22, 0);
  g.outputShaftGroup.add(subTable);
  rot.push({ obj: subTable, axis: 'y', speed: 0.8 });

  // Diffusion Pump Fluid Sump Box
  const diffSump = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.38), m.oilBathMat);
  diffSump.position.set(-0.95, -0.55, -0.45);
  g.oilSumpGroup.add(diffSump);
}

// ---------------------------------------------------------------------------
// 4. CNC MILLING MACHINE (3-Axis / 5-Axis)
// DMG MORI / Mazak Style High-Precision 5-Axis Machining Center
// ---------------------------------------------------------------------------
function buildCncMilling(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // Heavy Cast-Iron Bed
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.44, 2.0), m.darkCastIronMat);
  bed.position.set(0, -0.76, 0);
  g.lowerHousingGroup.add(bed);

  // X/Y Precision Ground Linear Rails
  const railX1 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.04, 0.06), m.machinedFlangeMat);
  railX1.position.set(0, -0.52, 0.55);
  const railX2 = railX1.clone();
  railX2.position.set(0, -0.52, -0.35);
  g.lowerHousingGroup.add(railX1, railX2);

  // Z-Axis Vertical Column
  const zColumn = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.85, 1.1), m.darkCastIronMat);
  zColumn.position.set(0, 0.35, -0.55);
  g.upperCoverGroup.add(zColumn);

  // Sliding Saddle on Z Column
  const zSaddle = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.65, 0.42), m.machinedFlangeMat);
  zSaddle.position.set(0, 0.42, -0.15);
  g.upperCoverGroup.add(zSaddle);

  // Telescopic Stainless Way Covers
  const wayCovers = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.1, 0.05), m.alloyShaftMat);
  wayCovers.position.set(0, 0.15, -0.28);
  g.frontWallGroup.add(wayCovers);

  // 5-Axis B-Axis Swivel Milling Head
  const swivelHead = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.38, 24), m.machinedFlangeMat);
  swivelHead.rotation.x = Math.PI / 2;
  swivelHead.position.set(0, 0.28, 0.12);
  g.inputShaftGroup.add(swivelHead);

  // 12,000 RPM Spindle Nose Cartridge
  const spindleCartridge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.42, 28), m.darkCastIronMat);
  spindleCartridge.position.set(0, 0.02, 0.12);
  g.inputShaftGroup.add(spindleCartridge);

  // HSK-A63 Tool Holder & End Mill Cutter (Rotating)
  const toolHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.045, 0.28, 20), m.alloyShaftMat);
  toolHolder.position.set(0, -0.24, 0.12);
  g.inputShaftGroup.add(toolHolder);
  rot.push({ obj: toolHolder, axis: 'y', speed: 3.5 });

  // Ceramic Hybrid Bearing Sleeve Rings
  const brgPack = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 16, 28), m.bearingBrassMat);
  brgPack.rotation.x = Math.PI / 2;
  brgPack.position.set(0, 0.12, 0.12);
  g.bearingsGroup.add(brgPack);

  // 24-Tool Disc Automatic Tool Changer (ATC) Carousel
  const atcDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.06, 24), m.gearCarburizedMat);
  atcDisc.position.set(-0.75, 0.72, -0.25);
  g.gearsGroup.add(atcDisc);
  rot.push({ obj: atcDisc, axis: 'y', speed: 0.5 });

  // C-Axis Rotary Trunnion Table
  const trunnionCradle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.7), m.darkCastIronMat);
  trunnionCradle.position.set(0, -0.42, 0.2);
  g.outputShaftGroup.add(trunnionCradle);

  const rotaryPlatter = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32), m.machinedFlangeMat);
  rotaryPlatter.position.set(0, -0.28, 0.2);
  g.outputShaftGroup.add(rotaryPlatter);
  rot.push({ obj: rotaryPlatter, axis: 'y', speed: 0.3 });

  // Machined Workpiece Part Clamped in Table
  const workpiece = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.28), m.alloyShaftMat);
  workpiece.position.set(0, -0.16, 0.2);
  g.outputShaftGroup.add(workpiece);

  // Coolant Sump & Cyclonic Filter
  const coolantTank = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.42), m.oilBathMat);
  coolantTank.position.set(0.92, -0.55, 0.65);
  g.oilSumpGroup.add(coolantTank);
}

// ---------------------------------------------------------------------------
// 5. CNC LATHE MACHINE (Turning)
// Okuma / Haas Heavy Slant-Bed Turning Center
// ---------------------------------------------------------------------------
function buildCncLathe(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // Rigid 45° Slant Bed Base
  const slantBed = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.52, 1.4), m.darkCastIronMat);
  slantBed.rotation.x = -Math.PI / 6; // 30-45 deg slant
  slantBed.position.set(0, -0.58, 0);
  g.lowerHousingGroup.add(slantBed);

  // Slanted Hardened Box Guideways
  const way1 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.08), m.machinedFlangeMat);
  way1.position.set(0, -0.42, -0.18);
  const way2 = way1.clone();
  way2.position.set(0, -0.55, 0.25);
  g.lowerHousingGroup.add(way1, way2);

  // Left Headstock Spindle Housing
  const headstock = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.68, 0.75), m.darkCastIronMat);
  headstock.position.set(-0.85, -0.18, 0);
  g.upperCoverGroup.add(headstock);

  // 3-Jaw Power Chuck (Rotating)
  const chuckGroup = new THREE.Group();
  chuckGroup.position.set(-0.45, -0.16, 0);
  const chuckBody = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.22, 28), m.machinedFlangeMat);
  chuckBody.rotation.z = Math.PI / 2;
  chuckGroup.add(chuckBody);

  // 3 Stepped Chuck Jaws
  for (let j = 0; j < 3; j++) {
    const angle = (j / 3) * Math.PI * 2;
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.08), m.alloyShaftMat);
    jaw.position.set(0.12, Math.cos(angle) * 0.24, Math.sin(angle) * 0.24);
    chuckGroup.add(jaw);
  }
  g.inputShaftGroup.add(chuckGroup);
  rot.push({ obj: chuckGroup, axis: 'x', speed: 2.8 });

  // Forged Steel Workpiece Shaft (Clamped in Chuck)
  const workpieceShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.95, 24), m.alloyShaftMat);
  workpieceShaft.rotation.z = Math.PI / 2;
  workpieceShaft.position.set(0.08, -0.16, 0);
  g.inputShaftGroup.add(workpieceShaft);
  rot.push({ obj: workpieceShaft, axis: 'x', speed: 2.8 });

  // Headstock Double-Row Bearings
  const brgRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.045, 16, 32), m.bearingBrassMat);
  brgRing.rotation.y = Math.PI / 2;
  brgRing.position.set(-0.58, -0.16, 0);
  g.bearingsGroup.add(brgRing);

  // 12-Station Servo Live Tooling Turret
  const turretSaddle = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.44, 0.52), m.darkCastIronMat);
  turretSaddle.position.set(0.05, 0.22, -0.22);
  g.gearsGroup.add(turretSaddle);

  const turretDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.16, 12), m.gearCarburizedMat);
  turretDisc.rotation.z = Math.PI / 2;
  turretDisc.position.set(0.05, 0.22, 0.12);
  g.gearsGroup.add(turretDisc);

  // Programmable Hydraulic Tailstock & Quill
  const tailstockBody = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.55), m.darkCastIronMat);
  tailstockBody.position.set(0.78, -0.18, 0);
  g.outputShaftGroup.add(tailstockBody);

  const quill = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 20), m.alloyShaftMat);
  quill.rotation.z = Math.PI / 2;
  quill.position.set(0.55, -0.16, 0);
  const revolvingCenter = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.12, 16), m.alloyShaftMat);
  revolvingCenter.rotation.z = -Math.PI / 2;
  revolvingCenter.position.set(0.36, -0.16, 0);
  g.outputShaftGroup.add(quill, revolvingCenter);

  // Slideway Lube Tank
  const slidewayLube = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.24), m.oilBathMat);
  slidewayLube.position.set(-0.95, -0.62, 0.48);
  g.oilSumpGroup.add(slidewayLube);
}

// ---------------------------------------------------------------------------
// 6. CONVENTIONAL VMC (Vertical Machining Center)
// Heavy-Duty BT-40 Vertical Production Mill
// ---------------------------------------------------------------------------
function buildVmcCenter(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // C-Frame Machine Bed
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.45, 1.8), m.darkCastIronMat);
  bed.position.set(0, -0.78, 0);
  g.lowerHousingGroup.add(bed);

  // Vertical Column Casting
  const column = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.95), m.darkCastIronMat);
  column.position.set(0, 0.25, -0.48);
  g.upperCoverGroup.add(column);

  // Vertical Z Headstock
  const headstock = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.72, 0.65), m.machinedFlangeMat);
  headstock.position.set(0, 0.35, 0.05);
  g.upperCoverGroup.add(headstock);

  // Accordion Way Covers
  const accordionWay = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.95, 0.04), m.darkCastIronMat);
  accordionWay.position.set(0, 0.08, -0.25);
  g.frontWallGroup.add(accordionWay);

  // BT-40 Spindle Nose Cartridge
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.13, 0.45, 28), m.alloyShaftMat);
  spindle.position.set(0, -0.05, 0.15);
  g.inputShaftGroup.add(spindle);

  // Face Mill Cutter Tool (Rotating)
  const faceMill = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16), m.gearCarburizedMat);
  faceMill.position.set(0, -0.32, 0.15);
  g.inputShaftGroup.add(faceMill);
  rot.push({ obj: faceMill, axis: 'y', speed: 3.0 });

  // Angular Contact Spindle Bearings
  const brgRing = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 16, 28), m.bearingBrassMat);
  brgRing.rotation.x = Math.PI / 2;
  brgRing.position.set(0, 0.05, 0.15);
  g.bearingsGroup.add(brgRing);

  // Side-Mount Twin-Arm Tool Changer Magazine
  const atcChain = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.95, 0.35), m.darkCastIronMat);
  atcChain.position.set(-0.75, 0.45, -0.15);
  const twinArm = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.12), m.alloyShaftMat);
  twinArm.position.set(-0.55, 0.02, 0.05);
  g.gearsGroup.add(atcChain, twinArm);

  // Precision T-Slot Milling Table
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 0.72), m.machinedFlangeMat);
  table.position.set(0, -0.48, 0.2);
  g.outputShaftGroup.add(table);

  // Precision Machine Vice Clamping Stock
  const vice = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.35), m.darkCastIronMat);
  vice.position.set(0, -0.32, 0.2);
  g.outputShaftGroup.add(vice);

  // Flood Coolant Tank
  const floodTank = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.38), m.oilBathMat);
  floodTank.position.set(0.95, -0.58, 0.55);
  g.oilSumpGroup.add(floodTank);
}

// ---------------------------------------------------------------------------
// 7. CENTRIFUGAL SLURRY PUMP (GP-108)
// ---------------------------------------------------------------------------
function buildCentrifugalPump(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // Pump Baseplate Pedestal
  const baseplate = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 1.3), m.darkCastIronMat);
  baseplate.position.set(0, -0.85, 0);
  g.lowerHousingGroup.add(baseplate);

  // Spiral Volute Pump Casing
  const volute = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.26, 20, 36), m.darkCastIronMat);
  volute.position.set(-0.25, -0.05, 0);
  g.lowerHousingGroup.add(volute);

  // Suction Eye Inlet Flange
  const suctionFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 28), m.machinedFlangeMat);
  suctionFlange.rotation.x = Math.PI / 2;
  suctionFlange.position.set(-0.25, -0.05, 0.42);
  g.frontWallGroup.add(suctionFlange);

  // Top Discharge Nozzle Flange
  const dischargeNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.55, 24), m.darkCastIronMat);
  dischargeNozzle.position.set(0.35, 0.48, 0);
  const dischargeFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24), m.machinedFlangeMat);
  dischargeFlange.position.set(0.35, 0.75, 0);
  g.upperCoverGroup.add(dischargeNozzle, dischargeFlange);

  // Impeller Rotor (Inside Volute - Rotating)
  const impellerGroup = new THREE.Group();
  impellerGroup.position.set(-0.25, -0.05, 0);
  const impellerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 24), m.bearingBrassMat);
  impellerHub.rotation.x = Math.PI / 2;
  impellerGroup.add(impellerHub);
  for (let v = 0; v < 6; v++) {
    const va = (v / 6) * Math.PI * 2;
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.14), m.bearingBrassMat);
    vane.position.set(Math.cos(va) * 0.32, Math.sin(va) * 0.32, 0);
    vane.rotation.z = va + 0.5;
    impellerGroup.add(vane);
  }
  g.inputShaftGroup.add(impellerGroup);
  rot.push({ obj: impellerGroup, axis: 'z', speed: 2.2 });

  // Bearing Frame Bracket
  const brgFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.75, 24), m.darkCastIronMat);
  brgFrame.rotation.z = Math.PI / 2;
  brgFrame.position.set(0.48, -0.05, 0);
  g.bearingsGroup.add(brgFrame);

  // Drive Shaft & Flexible Coupling
  const driveShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 24), m.alloyShaftMat);
  driveShaft.rotation.z = Math.PI / 2;
  driveShaft.position.set(0.65, -0.05, 0);
  const coupling = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 24), m.gearCarburizedMat);
  coupling.rotation.z = Math.PI / 2;
  coupling.position.set(1.05, -0.05, 0);
  g.outputShaftGroup.add(driveShaft, coupling);
  rot.push({ obj: driveShaft, axis: 'x', speed: 2.2 });
  rot.push({ obj: coupling, axis: 'x', speed: 2.2 });

  // Oil Sight Glass Sump
  const oilSump = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.26), m.oilBathMat);
  oilSump.position.set(0.48, -0.45, 0);
  g.oilSumpGroup.add(oilSump);
}

// ---------------------------------------------------------------------------
// 8. INDUSTRIAL MOTOR / COMPRESSOR (GC-310)
// ---------------------------------------------------------------------------
function buildIndustrialMotor(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // Motor Foot Mounting Base
  const baseFeet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.2), m.darkCastIronMat);
  baseFeet.position.set(0, -0.78, 0);
  g.lowerHousingGroup.add(baseFeet);

  // Cylindrical Stator Frame with Longitudinal Cooling Fins
  const statorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.45, 32), m.darkCastIronMat);
  statorBody.rotation.z = Math.PI / 2;
  statorBody.position.set(0, -0.05, 0);
  g.lowerHousingGroup.add(statorBody);

  // Cooling Fins
  for (let f = 0; f < 16; f++) {
    const fa = (f / 16) * Math.PI * 2;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.024, 0.12), m.darkCastIronMat);
    fin.position.set(0, -0.05 + Math.cos(fa) * 0.72, Math.sin(fa) * 0.72);
    fin.rotation.x = fa;
    g.lowerHousingGroup.add(fin);
  }

  // Top Terminal Conduit Junction Box
  const junctionBox = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.42), m.machinedFlangeMat);
  junctionBox.position.set(0, 0.82, 0);
  g.upperCoverGroup.add(junctionBox);

  // Front End-Shield & Bearing Housing
  const frontShield = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.14, 32), m.machinedFlangeMat);
  frontShield.rotation.z = Math.PI / 2;
  frontShield.position.set(0.78, -0.05, 0);
  const rearShield = frontShield.clone();
  rearShield.position.set(-0.78, -0.05, 0);
  g.frontWallGroup.add(frontShield, rearShield);

  // Motor Drive Shaft (Rotating)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.1, 28), m.alloyShaftMat);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.set(0.25, -0.05, 0);
  g.inputShaftGroup.add(shaft);
  rot.push({ obj: shaft, axis: 'x', speed: 2.5 });

  // Keyed Output Coupling Hub
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 24), m.gearCarburizedMat);
  hub.rotation.z = Math.PI / 2;
  hub.position.set(1.15, -0.05, 0);
  g.outputShaftGroup.add(hub);
  rot.push({ obj: hub, axis: 'x', speed: 2.5 });

  // Deep Groove Ball Bearings
  const brgDE = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.045, 16, 28), m.bearingBrassMat);
  brgDE.rotation.y = Math.PI / 2;
  brgDE.position.set(0.75, -0.05, 0);
  const brgNDE = brgDE.clone();
  brgNDE.position.set(-0.75, -0.05, 0);
  g.bearingsGroup.add(brgDE, brgNDE);

  // Internal Lube Reservoir
  const reservoir = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.24), m.oilBathMat);
  reservoir.position.set(0.45, -0.55, 0);
  g.oilSumpGroup.add(reservoir);
}

// ---------------------------------------------------------------------------
// 9. HELICAL POWERTRAIN GEARBOX (GT-204)
// ---------------------------------------------------------------------------
function buildHelicalGearbox(
  g: Machine3DGroups,
  m: Machine3DMaterials,
  rot: RotatingMeshItem[],
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  inShaftRadius: number,
  outShaftRadius: number
) {
  // Heavy Cast-Iron Finned Lower Housing & Machined Baseplate
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(scaleX * 1.16, 0.16, scaleZ * 1.2), m.darkCastIronMat);
  basePlate.position.set(0, -scaleY * 0.5 - 0.08, 0);
  g.lowerHousingGroup.add(basePlate);

  // Lower U-shaped Sump Casing
  const wallT = 0.09;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(scaleX, scaleY * 0.64, wallT), m.darkCastIronMat);
  backWall.position.set(0, -scaleY * 0.18, -scaleZ * 0.5 + wallT * 0.5);
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, scaleY * 0.64, scaleZ), m.darkCastIronMat);
  leftWall.position.set(-scaleX * 0.5 + wallT * 0.5, -scaleY * 0.18, 0);
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, scaleY * 0.64, scaleZ), m.darkCastIronMat);
  rightWall.position.set(scaleX * 0.5 - wallT * 0.5, -scaleY * 0.18, 0);
  g.lowerHousingGroup.add(backWall, leftWall, rightWall);

  // External Dissipation Fins
  for (let f = -5; f <= 5; f++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.028, scaleY * 0.52, scaleZ * 1.03), m.darkCastIronMat);
    fin.position.set(f * (scaleX * 0.082), -scaleY * 0.21, 0);
    g.lowerHousingGroup.add(fin);
  }

  // Split-Line Flange Rim
  const splitFlange = new THREE.Mesh(new THREE.BoxGeometry(scaleX * 1.08, 0.055, scaleZ * 1.08), m.machinedFlangeMat);
  splitFlange.position.set(0, 0.13, 0);
  g.lowerHousingGroup.add(splitFlange);

  // Upper Inspection Hood
  const topCover = new THREE.Mesh(new THREE.BoxGeometry(scaleX * 0.96, scaleY * 0.38, scaleZ * 0.94), m.darkCastIronMat);
  topCover.position.set(0, scaleY * 0.32, 0);
  g.upperCoverGroup.add(topCover);

  // Transparent Front Inspection Wall
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(scaleX * 0.98, scaleY * 0.62, wallT), m.translucentHoodMat);
  frontWall.position.set(0, -scaleY * 0.18, scaleZ * 0.5 - wallT * 0.5);
  g.frontWallGroup.add(frontWall);

  // Input High-Speed Shaft & Pinion (Rotating)
  const inShaft = new THREE.Mesh(new THREE.CylinderGeometry(inShaftRadius, inShaftRadius, scaleX * 0.95, 28), m.alloyShaftMat);
  inShaft.rotation.z = Math.PI / 2;
  inShaft.position.set(-scaleX * 0.25, 0.22, 0);
  const inPinion = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.25, 24), m.gearCarburizedMat);
  inPinion.rotation.z = Math.PI / 2;
  inPinion.position.set(-0.15, 0.22, 0);
  g.inputShaftGroup.add(inShaft, inPinion);
  rot.push({ obj: inShaft, axis: 'x', speed: 2.5 });
  rot.push({ obj: inPinion, axis: 'x', speed: 2.5 });

  // Intermediate Helical Reduction Stage
  const interGear = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.24, 32), m.gearCarburizedMat);
  interGear.rotation.z = Math.PI / 2;
  interGear.position.set(-0.15, 0.02, 0.18);
  g.intermediateShaftGroup.add(interGear);
  rot.push({ obj: interGear, axis: 'x', speed: -1.2 });

  // Output Bull Gear & Shaft
  const bullGear = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.28, 36), m.gearCarburizedMat);
  bullGear.rotation.z = Math.PI / 2;
  bullGear.position.set(0.22, -0.05, 0.14);
  const outShaft = new THREE.Mesh(new THREE.CylinderGeometry(outShaftRadius, outShaftRadius, scaleX * 0.92, 32), m.alloyShaftMat);
  outShaft.rotation.z = Math.PI / 2;
  outShaft.position.set(scaleX * 0.38, -0.05, 0.14);
  g.outputShaftGroup.add(bullGear, outShaft);
  rot.push({ obj: bullGear, axis: 'x', speed: 0.6 });
  rot.push({ obj: outShaft, axis: 'x', speed: 0.6 });

  // Spherical Roller Bearings
  const brg1 = new THREE.Mesh(new THREE.TorusGeometry(inShaftRadius * 1.5, 0.05, 16, 28), m.bearingBrassMat);
  brg1.rotation.y = Math.PI / 2;
  brg1.position.set(-scaleX * 0.44, 0.22, 0);
  const brg2 = new THREE.Mesh(new THREE.TorusGeometry(outShaftRadius * 1.4, 0.06, 16, 32), m.bearingBrassMat);
  brg2.rotation.y = Math.PI / 2;
  brg2.position.set(scaleX * 0.44, -0.05, 0.14);
  g.bearingsGroup.add(brg1, brg2);

  // Sump Lubrication Bath
  const oilBath = new THREE.Mesh(new THREE.BoxGeometry(scaleX * 0.92, scaleY * 0.28, scaleZ * 0.92), m.oilBathMat);
  oilBath.position.set(0, -scaleY * 0.34, 0);
  g.oilSumpGroup.add(oilBath);
}

// ---------------------------------------------------------------------------
// 0B. NASA C-MAPSS Turbofan Engine (Unit FD001)
// 90,000 lbf High-Bypass Dual-Spool Jet Engine:
// Titanium Fan (rotating Nf 2388 RPM), 9-Stage HPC (rotating Nc 9128 RPM)
// with Amber Blade Tip Degradation Glow, Annular Combustor with Core Flame,
// HPT/LPT Power Turbines, Exhaust Nozzle, Test Stand Pylon & FADEC Box.
// ---------------------------------------------------------------------------
function buildTurbofanEngine(g: Machine3DGroups, m: Machine3DMaterials, rot: RotatingMeshItem[]) {
  // 1. Heavy Test Cell Foundation & Mounting Pylon
  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 1.6), m.darkCastIronMat);
  bed.position.set(0, -1.05, 0);
  g.lowerHousingGroup.add(bed);

  // Forward and Aft Vertical Test Cradle Towers
  const fwdTower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.75, 1.2), m.machinedFlangeMat);
  fwdTower.position.set(-1.1, -0.68, 0);
  const aftTower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.75, 1.0), m.machinedFlangeMat);
  aftTower.position.set(1.1, -0.68, 0);
  g.lowerHousingGroup.add(fwdTower, aftTower);

  // Engine Thrust Mount Yoke / Struts
  const yokeL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 16), m.alloyShaftMat);
  yokeL.rotation.z = 0.35;
  yokeL.position.set(-1.0, -0.35, 0.45);
  const yokeR = yokeL.clone();
  yokeR.position.set(-1.0, -0.35, -0.45);
  g.lowerHousingGroup.add(yokeL, yokeR);

  // 2. Cutaway Outer Nacelle Cowling & Fan Case (Translucent / Sectioned)
  // Outer Cowl Ring (Intake Lip / Bellmouth)
  const intakeLip = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.08, 24, 48),
    m.aerospaceGoldMat
  );
  intakeLip.rotation.y = Math.PI / 2;
  intakeLip.position.set(-1.65, 0, 0);
  g.upperCoverGroup.add(intakeLip);

  // Outer Fan Cowl Barrel (semi-transparent cutaway so interior fan & core are visible)
  const cowlBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.02, 1.2, 36, 1, true, 0, Math.PI * 1.55),
    m.translucentHoodMat
  );
  cowlBarrel.rotation.z = Math.PI / 2;
  cowlBarrel.position.set(-1.05, 0, 0);
  g.upperCoverGroup.add(cowlBarrel);

  // Carbon Fiber Nacelle Lower Shell
  const lowerCowl = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.02, 1.2, 36, 1, true, Math.PI * 1.55, Math.PI * 0.45),
    m.carbonFiberMat
  );
  lowerCowl.rotation.z = Math.PI / 2;
  lowerCowl.position.set(-1.05, 0, 0);
  g.frontWallGroup.add(lowerCowl);

  // Core Engine Cowl Housing (Inner Bypass Duct Wall)
  const coreCowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.48, 2.2, 32, 1, true, 0, Math.PI * 1.6),
    m.machinedFlangeMat
  );
  coreCowl.rotation.z = Math.PI / 2;
  coreCowl.position.set(0.35, 0, 0);
  g.upperCoverGroup.add(coreCowl);

  // Bypass Stator Vanes (Guide vanes connecting core to outer casing)
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.02), m.carbonFiberMat);
    vane.position.set(-0.65, Math.sin(angle) * 0.8, Math.cos(angle) * 0.8);
    vane.rotation.x = angle;
    g.frontWallGroup.add(vane);
  }

  // 3. Low-Pressure Spool (LP Shaft & Titanium Fan Stage - Nf 2388 RPM)
  const lpShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 3.2, 24),
    m.alloyShaftMat
  );
  lpShaft.rotation.z = Math.PI / 2;
  lpShaft.position.set(0.0, 0, 0);
  g.inputShaftGroup.add(lpShaft);

  // Fan Rotor Hub & Aerodynamic Nose Cone (Spinner)
  const fanGroup = new THREE.Group();
  fanGroup.position.set(-1.45, 0, 0);

  const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.42, 28), m.carbonFiberMat);
  noseCone.rotation.z = Math.PI / 2;
  noseCone.position.set(-0.21, 0, 0);
  fanGroup.add(noseCone);

  const fanHubDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 28), m.machinedFlangeMat);
  fanHubDisc.rotation.z = Math.PI / 2;
  fanGroup.add(fanHubDisc);

  // 24 Titanium Wide-Chord Swept Fan Blades
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.035), m.alloyShaftMat);
    blade.position.set(0, Math.sin(angle) * 0.58, Math.cos(angle) * 0.58);
    blade.rotation.x = angle;
    blade.rotation.y = 0.28;
    fanGroup.add(blade);
  }
  g.inputShaftGroup.add(fanGroup);
  rot.push({ obj: fanGroup, axis: 'x', speed: 0.8 });
  rot.push({ obj: lpShaft, axis: 'x', speed: 0.8 });

  // 4. High-Pressure Compressor (HPC) - 9 Stages with Blade Tip Wear Highlight (Nc 9128 RPM)
  const hpcRotor = new THREE.Group();
  hpcRotor.position.set(-0.35, 0, 0);

  const hpcSpoolDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.26, 0.88, 28),
    m.alloyShaftMat
  );
  hpcSpoolDrum.rotation.z = Math.PI / 2;
  hpcRotor.add(hpcSpoolDrum);

  // 9 Compressor Discs of decreasing diameter (high compression ratio)
  for (let s = 0; s < 9; s++) {
    const xPos = -0.38 + s * 0.095;
    const radius = 0.46 - s * 0.018;
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.032, 28),
      m.machinedFlangeMat
    );
    disc.rotation.z = Math.PI / 2;
    disc.position.set(xPos, 0, 0);
    hpcRotor.add(disc);

    const bladeCount = 16 + s * 2;
    for (let b = 0; b < bladeCount; b += 2) {
      const bAngle = (b / bladeCount) * Math.PI * 2;
      const hpcBlade = new THREE.Mesh(new THREE.BoxGeometry(0.025, radius * 0.38, 0.015), m.alloyShaftMat);
      hpcBlade.position.set(xPos, Math.sin(bAngle) * (radius * 0.82), Math.cos(bAngle) * (radius * 0.82));
      hpcBlade.rotation.x = bAngle;
      hpcRotor.add(hpcBlade);
    }
  }

  // CRITICAL FAULT VISUALIZATION: HPC Stage 6-9 Blade Tip Wear Glowing Rings
  const hpcDegradationAura = new THREE.Mesh(
    new THREE.TorusGeometry(0.44, 0.028, 16, 36),
    m.glowingLaserMat
  );
  hpcDegradationAura.rotation.y = Math.PI / 2;
  hpcDegradationAura.position.set(0.16, 0, 0);
  hpcRotor.add(hpcDegradationAura);

  const hpcDegradationAura2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.024, 16, 36),
    m.glowingLaserMat
  );
  hpcDegradationAura2.rotation.y = Math.PI / 2;
  hpcDegradationAura2.position.set(0.26, 0, 0);
  hpcRotor.add(hpcDegradationAura2);

  g.bearingsGroup.add(hpcRotor);
  rot.push({ obj: hpcRotor, axis: 'x', speed: 2.2 });

  // 5. Annular Combustor Chamber (Hastelloy X with Core Flame Glow)
  const combustorHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.44, 0.52, 28, 1, true),
    m.gearCarburizedMat
  );
  combustorHousing.rotation.z = Math.PI / 2;
  combustorHousing.position.set(0.42, 0, 0);
  g.gearsGroup.add(combustorHousing);

  const flameCore = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.065, 16, 32),
    m.glowingMeltMat
  );
  flameCore.rotation.y = Math.PI / 2;
  flameCore.position.set(0.42, 0, 0);
  g.gearsGroup.add(flameCore);

  for (let f = 0; f < 16; f++) {
    const fAngle = (f / 16) * Math.PI * 2;
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 12), m.bearingBrassMat);
    nozzle.position.set(0.22, Math.sin(fAngle) * 0.38, Math.cos(fAngle) * 0.38);
    nozzle.rotation.z = Math.PI / 2;
    g.gearsGroup.add(nozzle);
  }

  // 6. High & Low Pressure Turbine Stages (HPT / LPT - CMSX-4 Superalloy)
  const turbineGroup = new THREE.Group();
  turbineGroup.position.set(0.95, 0, 0);

  const hptDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.06, 28), m.machinedFlangeMat);
  hptDisc.rotation.z = Math.PI / 2;
  hptDisc.position.set(-0.16, 0, 0);
  turbineGroup.add(hptDisc);

  const lptDisc1 = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.05, 28), m.machinedFlangeMat);
  lptDisc1.rotation.z = Math.PI / 2;
  lptDisc1.position.set(0.04, 0, 0);
  const lptDisc2 = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.05, 28), m.machinedFlangeMat);
  lptDisc2.rotation.z = Math.PI / 2;
  lptDisc2.position.set(0.18, 0, 0);
  turbineGroup.add(lptDisc1, lptDisc2);

  for (let tb = 0; tb < 20; tb++) {
    const tbAngle = (tb / 20) * Math.PI * 2;
    const tBlade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.02), m.aerospaceGoldMat);
    tBlade.position.set(0.18, Math.sin(tbAngle) * 0.52, Math.cos(tbAngle) * 0.52);
    tBlade.rotation.x = tbAngle;
    turbineGroup.add(tBlade);
  }

  g.outputShaftGroup.add(turbineGroup);
  rot.push({ obj: turbineGroup, axis: 'x', speed: 1.4 });

  // 7. Core Exhaust Plug & Convergent Propulsion Nozzle
  const exhaustPlug = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.82, 28), m.carbonFiberMat);
  exhaustPlug.rotation.z = -Math.PI / 2;
  exhaustPlug.position.set(1.68, 0, 0);
  g.outputShaftGroup.add(exhaustPlug);

  const exhaustNozzleRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.48, 0.04, 16, 36),
    m.aerospaceGoldMat
  );
  exhaustNozzleRing.rotation.y = Math.PI / 2;
  exhaustNozzleRing.position.set(1.45, 0, 0);
  g.outputShaftGroup.add(exhaustNozzleRing);

  // 8. FADEC Controller Box, Lube Scavenge Pump & Hydraulic Plumbing
  const fadecBox = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.24, 0.22), m.machinedFlangeMat);
  fadecBox.position.set(-0.85, 0.98, 0.42);
  g.oilSumpGroup.add(fadecBox);

  const harness1 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.1, 12), m.carbonFiberMat);
  harness1.rotation.z = 0.5;
  harness1.position.set(-0.35, 0.78, 0.42);
  g.oilSumpGroup.add(harness1);

  const lubePump = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.28, 16), m.bearingBrassMat);
  lubePump.rotation.z = Math.PI / 2;
  lubePump.position.set(-0.15, -0.62, 0.35);
  const oilTank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.28), m.machinedFlangeMat);
  oilTank.position.set(0.25, -0.62, 0.35);
  g.oilSumpGroup.add(lubePump, oilTank);
}
