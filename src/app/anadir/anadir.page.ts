import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Plant } from './../models/plant.model';
import { PlantaService } from './../plantanueva.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-anadir',
  templateUrl: './anadir.page.html',
  styleUrls: ['./anadir.page.scss'],
})
export class AnadirPage implements OnInit {
  planta: Plant = {
    id: '',
    common_name: '',
    description: '',
    tipo: '',
    tips: '',
    image_url: ''
  };
  photo: string = '';
  isEditMode: boolean = false;
  tiposDePlantas: string[] = ['Hierba', 'Arbusto', 'Árbol', 'Suculenta', 'Helecho', 'Cactus', 'Palmera', 'Conífera', 'Musgo', 'Orquídea'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantaService: PlantaService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const plantaId = this.route.snapshot.queryParamMap.get('id');
    if (plantaId) {
      const existingPlanta = this.plantaService.getPlantaById(plantaId);
      if (existingPlanta) {
        this.planta = { ...existingPlanta };
        this.photo = existingPlanta.image_url;
        this.isEditMode = true;
      }
    }
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    this.photo = image.dataUrl!;
  }

  async onSubmit() {
    if (this.isFormValid()) {
      this.planta.image_url = this.photo;
      if (this.isEditMode) {
        this.plantaService.updatePlanta(this.planta);
        this.showAlert('Éxito', 'Planta actualizada correctamente.');
      } else {
        this.planta.id = this.generateUniqueId();
        this.plantaService.addPlanta({ ...this.planta });
        this.showAlert('Éxito', 'Planta guardada correctamente.');
      }
      this.router.navigate(['/plantas']);
    } else {
      this.showAlert('Error', 'Por favor, completa todos los campos y añade una imagen.');
    }
  }

  generateUniqueId(): string {
    const existingPlantas = JSON.parse(localStorage.getItem('plantas') || '[]');
    let newId: string;
    do {
      newId = Math.floor(Math.random() * 1000000).toString();
    } while (existingPlantas.some((p: any) => p.id === newId));
    return newId;
  }

  isFormValid(): boolean {
    return this.planta.common_name !== '' &&
           this.planta.description !== '' &&
           this.planta.tipo !== '' &&
           this.planta.tips !== '' &&
           this.photo !== '';
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
