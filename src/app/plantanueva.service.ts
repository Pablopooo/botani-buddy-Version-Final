import { Injectable } from '@angular/core';
import { Plant } from './models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantaService {
  private plantas: Plant[] = [];

  constructor() {
    this.plantas = JSON.parse(localStorage.getItem('plantas') || '[]');
  }

  getPlantas(): Plant[] {
    return this.plantas;
  }

  addPlanta(planta: Plant) {
    this.plantas.push(planta);
    localStorage.setItem('plantas', JSON.stringify(this.plantas));
  }

  getPlantaById(id: string): Plant | undefined {
    return this.plantas.find(planta => planta.id === id);
  }

  updatePlanta(updatedPlanta: Plant) {
    const index = this.plantas.findIndex(planta => planta.id === updatedPlanta.id);
    if (index !== -1) {
      this.plantas[index] = updatedPlanta;
      localStorage.setItem('plantas', JSON.stringify(this.plantas));
    }
  }

  deletePlanta(id: string) {
    this.plantas = this.plantas.filter(planta => planta.id !== id);
    localStorage.setItem('plantas', JSON.stringify(this.plantas));
  }
}
