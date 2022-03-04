import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import * as L from 'leaflet';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {
  map: L.Map;
  constructor(private callNumber: CallNumber) { }

  ngOnInit() {
  }
  telefono(){
    this.callNumber.callNumber("674586553", true)
.then(res => console.log('Launched dialer!', res))
.catch(err => console.log('Error launching dialer', err));
 
}
ionViewDidEnter(){
  this.loadMap();
}

loadMap() {
  let latitud = 36.679735;
  let longitud = -5.4450258;
  let zoom = 30;
  this.map = L.map("mapId").setView([latitud, longitud], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this.map);
}

}
