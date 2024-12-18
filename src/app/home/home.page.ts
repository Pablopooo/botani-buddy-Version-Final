import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantaService } from './../plantanueva.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Plant } from './../models/plant.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: string | null = '';
  plantas: Plant[] = [];
  showVerMas: boolean = false;
  proximaAlarma: any = null;
  mensajeAlarma: string = '';

  constructor(private router: Router, private plantaService: PlantaService) { }

  ngOnInit() {
    this.usuario = localStorage.getItem('usuario');
    this.loadPlantas();
    this.loadProximaAlarma();
  }

  loadPlantas() {
    const allPlantas = this.plantaService.getPlantas();
    this.plantas = allPlantas.slice(0, 5); // Obtener las primeras cinco plantas guardadas
    this.showVerMas = allPlantas.length > 5;
  }

  loadProximaAlarma() {
    const allAlarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
    if (allAlarmas.length > 0) {
      const now = new Date();
      allAlarmas.sort((a: any, b: any) => {
        const dateA = new Date(a.schedule.at);
        const dateB = new Date(b.schedule.at);
        return dateA.getTime() - dateB.getTime();
      });
      const upcomingAlarm = allAlarmas.find((alarma: any) => new Date(alarma.schedule.at) > now);
      this.proximaAlarma = upcomingAlarm || allAlarmas[0];

      if (this.proximaAlarma) {
        const alarmDate = new Date(this.proximaAlarma.schedule.at);
        const plantName = this.proximaAlarma.extra?.plantName || 'tu planta';
        this.mensajeAlarma = `La alarma más próxima es para ${plantName} el ${alarmDate.toLocaleDateString('es-ES', { weekday: 'long' })} a las ${alarmDate.getHours().toString().padStart(2, '0')}:${alarmDate.getMinutes().toString().padStart(2, '0')}, ¡espero no te olvides de tu valiosa planta!`;
      }
    }
  }

  goToGuardadas(planta: Plant) {
    this.router.navigate(['/guardadas', planta.id]);
  }

  goToPlantasMias(planta: Plant) {
    this.router.navigate(['/plantas-mias', planta.id]);
  }

  goToPlantas() {
    this.router.navigate(['/plantas']);
  }
}
