import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { Sensor, SensorType } from '../models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService implements OnDestroy {
  private sensors: Sensor[] = [
    {
      id: '1',
      name: 'Sensor 1',
      type: 'Soil Moisture',
      lat: 53.270051,
      lng: 6.564448,
      createdAt: new Date(),
      currentValue: 45.2,
      lastUpdate: new Date(),
      isTransmitting: false,
      isOperational: true
    },
    {
      id: '2',
      name: 'Sensor 2',
      type: 'Soil NPK',
      lat: 53.268500,
      lng: 6.562000,
      createdAt: new Date(),
      currentValue: 320,
      lastUpdate: new Date(),
      isTransmitting: false,
      isOperational: false
    },
    {
      id: '3',
      name: 'Sensor 3',
      type: 'pH',
      lat: 53.271500,
      lng: 6.567000,
      createdAt: new Date(),
      currentValue: 6.8,
      lastUpdate: new Date(),
      isTransmitting: false,
      isOperational: true
    },
    {
      id: '4',
      name: 'Sensor 4',
      type: 'Soil Moisture',
      lat: 53.269000,
      lng: 6.565500,
      createdAt: new Date(),
      currentValue: 52.7,
      lastUpdate: new Date(),
      isTransmitting: false,
      isOperational: true
    }
  ];

  private sensorsSubject = new BehaviorSubject<Sensor[]>(this.sensors);
  public sensors$ = this.sensorsSubject.asObservable();
  private transmissionSubscription?: Subscription;

  constructor() {
    this.startDataTransmission();
  }

  ngOnDestroy(): void {
    if (this.transmissionSubscription) {
      this.transmissionSubscription.unsubscribe();
    }
  }

  private startDataTransmission(): void {
    this.transmissionSubscription = interval(3000).subscribe(() => {
      const operationalSensors = this.sensors.filter(s => s.isOperational);
      if (operationalSensors.length > 0) {
        const randomSensor = operationalSensors[Math.floor(Math.random() * operationalSensors.length)];
        this.simulateTransmission(randomSensor);
      }
    });
  }

  private simulateTransmission(sensor: Sensor): void {
    if (!sensor.isOperational) return;
    
    sensor.isTransmitting = true;
    sensor.lastUpdate = new Date();
    sensor.currentValue = this.generateSensorValue(sensor.type);
    
    this.sensorsSubject.next([...this.sensors]);

    setTimeout(() => {
      sensor.isTransmitting = false;
      this.sensorsSubject.next([...this.sensors]);
    }, 1000);
  }

  private generateSensorValue(type: SensorType): number {
    switch (type) {
      case 'Soil Moisture':
        return Math.random() * 100;
      case 'Soil NPK':
        return Math.random() * 500;
      case 'pH':
        return 4 + Math.random() * 5;
      default:
        return Math.random() * 100;
    }
  }

  getSensors(): Sensor[] {
    return this.sensors;
  }

  addSensor(name: string, type: SensorType, lat: number, lng: number): Sensor {
    const newSensor: Sensor = {
      id: Date.now().toString(),
      name,
      type,
      lat,
      lng,
      createdAt: new Date(),
      currentValue: this.generateSensorValue(type),
      lastUpdate: new Date(),
      isTransmitting: false,
      isOperational: true
    };
    this.sensors.push(newSensor);
    this.sensorsSubject.next(this.sensors);
    return newSensor;
  }

  getSensorById(id: string): Sensor | undefined {
    return this.sensors.find(s => s.id === id);
  }

  getValueUnit(type: SensorType): string {
    switch (type) {
      case 'Soil Moisture':
        return '%';
      case 'Soil NPK':
        return 'ppm';
      case 'pH':
        return '';
      default:
        return '';
    }
  }
}

