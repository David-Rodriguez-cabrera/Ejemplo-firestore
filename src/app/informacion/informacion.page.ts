import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(private callNumber: CallNumber) { }

  ngOnInit() {
  }
  telefono(){
    this.callNumber.callNumber("674586553", true)
.then(res => console.log('Launched dialer!', res))
.catch(err => console.log('Error launching dialer', err));
 
}

}
