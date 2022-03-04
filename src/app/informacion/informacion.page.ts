import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
var L = require('leaflet');

var Routing = require('leaflet-routing-machine');
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {
  map: any;
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
  this.map = L.map("mapId");
  let latitud = 36.679735;
  let longitud = -5.4450258;
  let zoom = 20;
  this.map.setView([latitud, longitud], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this.map);

      L.Routing.control({
        waypoints: [
          L.latLng(36.6752207, -5.4459883),
          L.latLng(36.679735, -5.4450258)
        ]
      }).addTo(this.map);
    L.marker([36.6752207, -5.4459883]).addTo(this.map).bindPopup('Mi ubicación').openPopup();
    L.marker([36.679735, -5.4450258]).addTo(this.map).bindPopup('Ubicación Empresa').openPopup();
    
}

}
