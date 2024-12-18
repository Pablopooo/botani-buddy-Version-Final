import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantaService } from './../plantanueva.service';
import { Plant } from './../models/plant.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.page.html',
  styleUrls: ['./plantas.page.scss'],
})
export class PlantasPage implements OnInit {
  plantas: Plant[] = [];

  constructor(private router: Router, private plantaService: PlantaService, private alertController: AlertController) {}

  ngOnInit() {
    this.loadPlantas();
  }

  loadPlantas() {
    this.plantas = this.plantaService.getPlantas();
  }

  async confirmDeletePlanta(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar esta planta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deletePlanta(id);
          }
        }
      ]
    });

    await alert.present();
  }

  deletePlanta(id: string) {
    this.plantaService.deletePlanta(id);
    this.loadPlantas(); // Recargar las plantas después de la eliminación
  }

  goToAnadir() {
    this.router.navigate(['/anadir']);
  }

  goToPlantasMias(planta: Plant) {
    this.router.navigate(['/plantas-mias', planta.id]);
  }

  goToGuardadas(planta: Plant) {
    this.router.navigate(['/guardadas', planta.id]);
  }
}
