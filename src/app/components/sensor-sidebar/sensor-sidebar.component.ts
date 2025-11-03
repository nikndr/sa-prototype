import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { SensorService } from '../../services/sensor.service';
import { Sensor, SensorType } from '../../models/sensor.model';

@Component({
  selector: 'app-sensor-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-sidebar.component.html',
  styleUrls: ['./sensor-sidebar.component.css']
})
export class SensorSidebarComponent implements OnInit, OnDestroy {
  @Input() map!: mapboxgl.Map;

  isFormVisible = false;
  sensorName = '';
  sensorType: SensorType = 'Soil Moisture';
  selectedLat?: number;
  selectedLng?: number;
  appVersion: string = '1.0.0';
  selectedSensor?: Sensor;

  sensorTypes: SensorType[] = ['Soil Moisture', 'Soil NPK', 'pH'];
  sensors: Sensor[] = [];
  
  private tempMarker?: mapboxgl.Marker;
  private clickHandler?: (e: mapboxgl.MapMouseEvent) => void;

  constructor(private sensorService: SensorService) {
    this.appVersion = (window as any).APP_VERSION || '1.0.0';
  }

  ngOnInit(): void {
    this.sensors = this.sensorService.getSensors();
    this.sensorService.sensors$.subscribe(sensors => {
      this.sensors = sensors;
    });
  }

  ngOnDestroy(): void {
    this.disablePinDropping();
  }

  showForm(): void {
    this.isFormVisible = true;
    this.enablePinDropping();
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.disablePinDropping();
    this.resetForm();
  }

  private resetForm(): void {
    this.sensorName = '';
    this.sensorType = 'Soil Moisture';
    this.selectedLat = undefined;
    this.selectedLng = undefined;
  }

  private enablePinDropping(): void {
    this.map.getCanvas().style.cursor = 'crosshair';
    
    this.clickHandler = (e: mapboxgl.MapMouseEvent) => {
      this.selectedLat = e.lngLat.lat;
      this.selectedLng = e.lngLat.lng;

      if (this.tempMarker) {
        this.tempMarker.remove();
      }

      const el = document.createElement('div');
      el.className = 'temp-marker';
      el.style.willChange = 'transform';
      el.innerHTML = '📍';

      this.tempMarker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([this.selectedLng, this.selectedLat])
        .addTo(this.map);
    };

    this.map.on('click', this.clickHandler);
  }

  private disablePinDropping(): void {
    this.map.getCanvas().style.cursor = '';
    
    if (this.clickHandler) {
      this.map.off('click', this.clickHandler);
    }

    if (this.tempMarker) {
      this.tempMarker.remove();
    }
  }

  onSubmit(): void {
    if (!this.sensorName.trim()) {
      alert('Please enter a sensor name');
      return;
    }

    if (this.selectedLat === undefined || this.selectedLng === undefined) {
      alert('Please select a location on the map');
      return;
    }

    this.sensorService.addSensor(
      this.sensorName,
      this.sensorType,
      this.selectedLat,
      this.selectedLng
    );

    this.hideForm();
  }

  getSensorColor(type: string): string {
    switch (type) {
      case 'Soil Moisture':
        return '#3B82F6';
      case 'Soil NPK':
        return '#10B981';
      case 'pH':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  }

  selectSensor(sensor: Sensor): void {
    this.selectedSensor = sensor;
  }

  clearSelection(): void {
    this.selectedSensor = undefined;
  }

  formatSensorValue(sensor: Sensor): string {
    if (!sensor.currentValue) return 'N/A';
    const unit = this.sensorService.getValueUnit(sensor.type);
    return `${sensor.currentValue.toFixed(1)}${unit}`;
  }

  getTimeSinceUpdate(lastUpdate?: Date): string {
    if (!lastUpdate) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) {
      return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`;
    } else {
      const diffMins = Math.floor(diffSecs / 60);
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
  }
}

