import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alarmas',
  templateUrl: './alarmas.page.html',
  styleUrls: ['./alarmas.page.scss'],
})
export class AlarmasPage implements OnInit {
  alarmas: any[] = [];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    this.loadAlarmas();

    // Listener para notificaciones recibidas
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notificación recibida:', notification);
    });

    // Listener para acciones de notificaciones
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notificación activada:', notification);
    });
  }

  loadAlarmas() {
    const storedAlarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
    this.alarmas = storedAlarmas.map((alarma: any) => {
      const days = Array.isArray(alarma.schedule?.on?.weekday) ? alarma.schedule.on.weekday : [alarma.schedule?.on?.weekday];
      return {
        id: alarma.id,
        body: alarma.body,
        days: this.getDaysFromWeekdays(days),
        hour: alarma.schedule?.on?.hour !== undefined && alarma.schedule?.on?.minute !== undefined ? 
              `${alarma.schedule.on.hour.toString().padStart(2, '0')}:${alarma.schedule.on.minute.toString().padStart(2, '0')}` : 'N/A'
      };
    });
  }

  getDaysFromWeekdays(weekday: number[]): string[] {
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return weekday.map(day => daysOfWeek[day]);
  }

  async deleteAlarma(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar esta alarma?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.alarmas = this.alarmas.filter(alarma => alarma.id !== id);
            localStorage.setItem('alarmas', JSON.stringify(this.alarmas));
            LocalNotifications.cancel({ notifications: [{ id }] });
            this.loadAlarmas();
          }
        }
      ]
    });

    await alert.present();
  }
}
