import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardadasPage } from './guardadas.page';

const routes: Routes = [
  {
    path: '',
    component: GuardadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuardadasPageRoutingModule {}
