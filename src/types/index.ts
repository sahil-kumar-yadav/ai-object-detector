export interface DetectedObject {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface DetectionStats {
  fps: number;
  totalDetections: number;
  uniqueObjects: Record<string, number>;
  inferenceTime: number;
}

export interface ModelState {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  backend: string;
}

export interface WebcamState {
  isReady: boolean;
  hasPermission: boolean | null;
  error: string | null;
}

export interface AppSettings {
  mirror: boolean;
  showLabels: boolean;
  showBoundingBoxes: boolean;
  audioAlerts: boolean;
  funMode: boolean;
  confidenceThreshold: number;
}

export type DetectionClass =
  | "person"
  | "car"
  | "dog"
  | "cat"
  | "bird"
  | "bicycle"
  | "motorcycle"
  | "bus"
  | "train"
  | "truck"
  | "boat"
  | "traffic light"
  | "fire hydrant"
  | "stop sign"
  | "bench"
  | string;

