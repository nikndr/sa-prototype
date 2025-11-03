import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor.model';
import { Subscription } from 'rxjs';
import { SensorSidebarComponent } from '../sensor-sidebar/sensor-sidebar.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, SensorSidebarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map!: mapboxgl.Map;
  private sensorsSubscription?: Subscription;
  private popups: mapboxgl.Popup[] = [];

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.sensorsSubscription) {
      this.sensorsSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiamFwc2VydC0iLCJhIjoiY21oajExb2VrMTR0ajJtczdrZTd1dnpuZSJ9.YmDUo8bznxM18utTBm4BuQ';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [6.564448, 53.270051],
      zoom: 14
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.setupSensorLayer();
      this.subscribeToSensors();
    });
  }

  private setupSensorLayer(): void {
    this.map.addSource('sensors', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    this.map.addLayer({
      id: 'sensors-pulse',
      type: 'circle',
      source: 'sensors',
      filter: ['==', ['get', 'isTransmitting'], true],
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 20,
          20, 40
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'isOperational'], false],
          '#EF4444',
          [
            'match',
            ['get', 'type'],
            'Soil Moisture', '#3B82F6',
            'Soil NPK', '#10B981',
            'pH', '#F59E0B',
            '#6B7280'
          ]
        ],
        'circle-opacity': 0.7,
        'circle-stroke-width': 0
      }
    });

    this.map.addLayer({
      id: 'sensors-layer',
      type: 'circle',
      source: 'sensors',
      paint: {
        'circle-radius': 15,
        'circle-color': [
          'case',
          ['==', ['get', 'isOperational'], false],
          '#EF4444',
          [
            'match',
            ['get', 'type'],
            'Soil Moisture', '#3B82F6',
            'Soil NPK', '#10B981',
            'pH', '#F59E0B',
            '#6B7280'
          ]
        ],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff'
      }
    });

    this.map.addLayer({
      id: 'sensors-inner',
      type: 'circle',
      source: 'sensors',
      paint: {
        'circle-radius': 4,
        'circle-color': '#ffffff'
      }
    });

    this.map.on('mouseenter', 'sensors-layer', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'sensors-layer', () => {
      this.map.getCanvas().style.cursor = '';
    });

    this.map.on('click', 'sensors-layer', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates.slice();
        const properties = feature.properties!;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        this.popups.forEach(p => p.remove());
        this.popups = [];

        const timeSinceUpdate = this.getTimeSinceUpdate(properties['lastUpdate']);
        const valueUnit = this.sensorService.getValueUnit(properties['type']);
        const isOperational = properties['isOperational'];

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: true
        })
          .setLngLat(coordinates)
          .setHTML(`
            <div class="sensor-popup">
              <h3>${properties['name']}</h3>
              ${!isOperational ? '<div class="sensor-status-warning">⚠️ Sensor Not Operational</div>' : ''}
              <p><strong>Type:</strong> ${properties['type']}</p>
              <p><strong>Status:</strong> <span class="sensor-status ${isOperational ? 'operational' : 'not-operational'}">${isOperational ? 'Operational' : 'Not Operational'}</span></p>
              <p><strong>Current Value:</strong> <span class="sensor-value">${properties['currentValue']}${valueUnit}</span></p>
              <p><strong>Last Update:</strong> ${timeSinceUpdate}</p>
              <p><strong>Location:</strong> ${properties['lat']}, ${properties['lng']}</p>
            </div>
          `)
          .addTo(this.map);

        this.popups.push(popup);
      }
    });

    this.startPulseAnimation();
  }

  private startPulseAnimation(): void {
    let pulseRadius = 20;
    let growing = true;

    const animate = () => {
      if (growing) {
        pulseRadius += 0.3;
        if (pulseRadius >= 35) growing = false;
      } else {
        pulseRadius -= 0.3;
        if (pulseRadius <= 20) growing = true;
      }

      if (this.map.getLayer('sensors-pulse')) {
        this.map.setPaintProperty('sensors-pulse', 'circle-radius', pulseRadius);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  private getTimeSinceUpdate(lastUpdateStr: string): string {
    const lastUpdate = new Date(lastUpdateStr);
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

  private subscribeToSensors(): void {
    this.sensorsSubscription = this.sensorService.sensors$.subscribe(sensors => {
      this.updateSensorLayer(sensors);
    });
  }

  private updateSensorLayer(sensors: Sensor[]): void {
    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: sensors.map(sensor => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [sensor.lng, sensor.lat]
        },
        properties: {
          id: sensor.id,
          name: sensor.name,
          type: sensor.type,
          lat: sensor.lat.toFixed(4),
          lng: sensor.lng.toFixed(4),
          currentValue: sensor.currentValue ? sensor.currentValue.toFixed(1) : 'N/A',
          lastUpdate: sensor.lastUpdate?.toISOString() || new Date().toISOString(),
          isTransmitting: sensor.isTransmitting || false,
          isOperational: sensor.isOperational
        }
      }))
    };

    const source = this.map.getSource('sensors') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(geojsonData);
    }
  }
}

