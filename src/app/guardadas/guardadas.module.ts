import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuardadasPageRoutingModule } from './guardadas-routing.module';

import { GuardadasPage } from './guardadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardadasPageRoutingModule
  ],
  declarations: [GuardadasPage]
})
export class GuardadasPageModule {}
