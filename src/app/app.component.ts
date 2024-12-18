import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { MenuController, NavController } from '@ionic/angular';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Página Principal', url: '/home', icon: 'home' },
    { title: 'Mis Plantas', url: '/plantas', icon: 'flower' },
    { title: 'Añadir Planta', url: '/anadir', icon: 'leaf' },
    { title: 'Ayudas prácticas', url: '/ayudas', icon: 'help' },
    { title: 'Alarmas', url: '/alarmas', icon: 'alarm' },
  ];

  constructor(
    public authService: AuthService,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.toggleMenu();
  }

  toggleMenu() {
    this.menuCtrl.enable(this.authService.isLoggedIn());
  }

  toggleTheme() { 
    this.themeService.toggleTheme(); 
  }

  logout() {
    this.authService.logout();
    this.menuCtrl.enable(false);
    this.navCtrl.navigateRoot('/login'); // Redirigir al login
  }
}
