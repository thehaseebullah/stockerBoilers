export interface ScenarioStep {
  as?: string;
  do?: string;
  with?: Record<string, unknown>;
  wait?: string;
  device?: {
    gps?: "inside" | "outside" | "poor_accuracy";
    network?: "online" | "offline" | "slow";
    clockSkew?: number;
  };
  media?: string[];
  expect?: Record<string, unknown>;
}

export interface Scenario {
  name: string;
  description?: string;
  actors: Record<string, string>;
  steps: ScenarioStep[];
}

export interface VirtualDeviceState {
  id: string;
  role: string;
  isOnline: boolean;
  gpsLocation: {
    lat: number;
    lng: number;
    accuracy: number;
    isInsideGeofence: boolean;
  };
  clockSkewSeconds: number;
}
