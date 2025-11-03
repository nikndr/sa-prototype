export type SensorType = 'Soil Moisture' | 'Soil NPK' | 'pH';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  lat: number;
  lng: number;
  createdAt: Date;
  currentValue?: number;
  lastUpdate?: Date;
  isTransmitting?: boolean;
  isOperational: boolean;
}

export interface SensorReading {
  sensorId: string;
  value: number;
  timestamp: Date;
}

