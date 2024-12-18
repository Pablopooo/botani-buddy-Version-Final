import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantaService } from './../plantanueva.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Plant } from './../models/plant.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-plantas-mias',
  templateUrl: './plantas-mias.page.html',
  styleUrls: ['./plantas-mias.page.scss'],
})
export class PlantasMiasPage implements OnInit {
  planta: Plant | undefined;
  days: string[] = [];
  hour: string = '08:00'; // Hora por defecto

  constructor(
    private route: ActivatedRoute,
    private plantaService: PlantaService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planta = this.plantaService.getPlantaById(id);
    }

    // Solicitar permisos de notificaciones
    LocalNotifications.requestPermissions().then(permission => {
      if (permission.display === 'granted') {
        console.log('Permisos de notificación otorgados');
      } else {
        console.error('Permisos de notificación denegados');
      }
    });

    // Listener para notificaciones recibidas
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notificación recibida:', notification);
    });

    // Listener para acciones de notificaciones
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notificación activada:', notification);
    });
  }

  async setAlarm() {
    if (this.planta && this.days.length > 0 && this.hour) {
      const [hour, minute] = this.hour.split(':').map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        const notifications = this.days.map(day => {
          const dayOfWeek = this.getDayOfWeek(day);
          const nextDate = this.getNextDate(dayOfWeek, hour, minute, -5); // 5 minutos antes

          return {
            title: 'Recordatorio de Riego',
            body: `En 5 minutos más te corresponde regar tu planta ${this.planta?.common_name}, no te olvides!!!`,
            id: this.generateUniqueId(),
            schedule: {
              on: {
                weekday: dayOfWeek,
                hour: hour,
                minute: minute
              },
              at: nextDate,
              repeats: true
            },
            extra: { 
              enabled: true,
              plantName: this.planta?.common_name // Guardar el nombre de la planta en 'extra'
            }
          };
        });

        await LocalNotifications.schedule({ notifications });
        this.saveAlarmas(notifications);
        this.showConfirmation();
      } else {
        console.error('Hora no válida:', this.hour);
      }
    } else {
      console.error('Complete todos los campos para configurar la alarma.');
    }
  }

  getNextDate(dayOfWeek: number, hour: number, minute: number, offsetMinutes: number): Date {
    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + ((dayOfWeek + 7 - now.getDay()) % 7));
    nextDate.setHours(hour, minute + offsetMinutes, 0, 0);
    return nextDate;
  }

  getDayOfWeek(day: string): number {
    const daysOfWeek = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };
    return daysOfWeek[day.toLowerCase() as keyof typeof daysOfWeek];
  }

  generateUniqueId(): number {
    const existingAlarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
    let newId: number;
    do {
      newId = Math.floor(Math.random() * 1000000);
    } while (existingAlarmas.some((a: any) => a.id === newId));
    return newId;
  }

  saveAlarmas(notifications: any[]) {
    const savedAlarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
    const updatedAlarmas = [...savedAlarmas, ...notifications];
    localStorage.setItem('alarmas', JSON.stringify(updatedAlarmas));
  }

  async showConfirmation() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Alarma configurada correctamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
