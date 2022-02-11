import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { RouterModule, Routes } from '@angular/router';
import { InformacionPage } from './informacion.page';
import { HomePage } from '../home/home.page';

const routes: Routes = [
   {
     path: 'home',
    //  component: HomePage
    redirectTo: '/home',
     
  },
  {
    path: '',
    component: InformacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionPageRoutingModule {}
