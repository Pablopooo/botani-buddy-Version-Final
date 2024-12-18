import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantaService } from './../plantanueva.service';
import { Plant } from './../models/plant.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-guardadas',
  templateUrl: './guardadas.page.html',
  styleUrls: ['./guardadas.page.scss'],
})
export class GuardadasPage implements OnInit {
  planta: Plant | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantaService: PlantaService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadPlanta();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadPlanta();
      }
    });
  }

  loadPlanta() {
    const plantaId = this.route.snapshot.paramMap.get('id');
    if (plantaId) {
      this.planta = this.plantaService.getPlantaById(plantaId);
    }
  }

  goBackToList() {
    this.router.navigate(['/plantas']);
  }

  editPlanta() {
    if (this.planta) {
      this.router.navigate(['/anadir'], { queryParams: { id: this.planta.id } });
    }
  }

  async deletePlanta() {
    if (this.planta) {
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
              this.plantaService.deletePlanta(this.planta!.id);
              this.goBackToList();
            }
          }
        ]
      });

      await alert.present();
    }
  }
}
