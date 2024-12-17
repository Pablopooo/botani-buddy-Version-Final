import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.resetForm = this.fb.group({
      nuevaContraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    const { nuevaContraseña, confirmarContraseña } = this.resetForm.value;

    if (nuevaContraseña !== confirmarContraseña) {
      await this.showAlertMessage('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Actualizar contraseña en el local storage
    localStorage.setItem('contraseña', nuevaContraseña);
    await this.showAlertMessage('Éxito', 'Contraseña actualizada exitosamente');
    this.navCtrl.navigateBack('/login');
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }

  async showAlertMessage(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }
}
