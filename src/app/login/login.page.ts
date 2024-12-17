import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private navCtrl: NavController, private authService: AuthService, private menuCtrl: MenuController) {}

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { usuario, contraseña } = this.loginForm.value;

      if (this.authService.login(usuario, contraseña)) {
        this.menuCtrl.enable(true);
        localStorage.setItem('usuario', usuario);
        await this.showSuccessMessage();
        this.navCtrl.navigateForward('/home');
      } else {
        await this.showErrorMessage('Usuario o contraseña incorrectos');
      }
    }
  }

  async showErrorMessage(message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Error';
    alert.message = message;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }

  async showSuccessMessage() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Éxito';
    alert.message = 'Inicio de sesión exitoso';
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }

  resetPassword() {
    console.log('Botón de restablecer contraseña presionado');
    this.router.navigate(['/reset-password']);
  }
}
