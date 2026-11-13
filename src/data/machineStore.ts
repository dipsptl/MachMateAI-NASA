/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MechMate AI Machine Store & Fleet Inventory
 * Supports standard industrial machinery and aerospace test infrastructure,
 * including the official NASA IMS Rexnord ZA-2115 Bearing Rig benchmark.
 */

import { MachineProfile, SensorNodeConfig, TimeSeriesPoint } from '../models/types';
import {
  INITIAL_MACHINES,
  NASA_IMS_RIG_MACHINE,
  NASA_CMAPSS_TURBOFAN_MACHINE,
  ENGINEERING_KNOWLEDGE_BASE,
  generateTimeSeriesForScenario,
} from './sampleData';

export {
  INITIAL_MACHINES,
  NASA_IMS_RIG_MACHINE,
  NASA_CMAPSS_TURBOFAN_MACHINE,
  ENGINEERING_KNOWLEDGE_BASE,
  generateTimeSeriesForScenario,
};

export const getMachineById = (id: string): MachineProfile | undefined => {
  return INITIAL_MACHINES.find((m) => m.id === id);
};

export const getMachinesByCategory = (category: string): MachineProfile[] => {
  return INITIAL_MACHINES.filter((m) => m.category === category);
};

export const getSpaceAndAerospaceMachines = (): MachineProfile[] => {
  return INITIAL_MACHINES.filter(
    (m) =>
      m.category === 'Space & Aerospace' ||
      m.category === 'Aerospace & Space Test Infrastructure' ||
      m.id.toLowerCase().startsWith('nasa') ||
      m.id.toLowerCase().startsWith('iss')
  );
};

export const getStandardIndustrialMachines = (): MachineProfile[] => {
  return INITIAL_MACHINES.filter(
    (m) =>
      m.category !== 'Space & Aerospace' &&
      m.category !== 'Aerospace & Space Test Infrastructure' &&
      !m.id.toLowerCase().startsWith('nasa') &&
      !m.id.toLowerCase().startsWith('iss')
  );
};
