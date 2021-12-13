import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
id: string = "";

document: any = {
  id: "",
  data: {} as Tarea
};

  constructor(private firestoreService: FirestoreService, private activateRoute: ActivatedRoute, public alertController: AlertController) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.firestoreService.consultarPorId("tareas", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.titulo);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Tarea;
      } 
    });
  }

  clickBotonInsertar() {
    this.firestoreService.insertar("tareas", this.document.data)
    .then(() =>{
      console.log("Tarea creada correctamente")
      // Limpiar el contenido de la tarea que se estaba editando
      this.document.data = {} as Tarea;
    }, (error) => {
      console.error(error);
    });

  }

 

  clicBotonBorrar() {
    
    this.firestoreService.borrar("tareas", this.id).then(() => {
      // Actualizar la lista completa
      this.ngOnInit();
      // Limpiar datos de pantalla
      this.document.data = {} as Tarea;
    })
  }



  clicBotonModificar() {
    this.firestoreService.actualizar("tareas", this.id, this.document.data).then(() => {
      // Actualizar la lista completa
      this.ngOnInit();
      // Limpiar datos de pantalla
      this.document.data = {} as Tarea;
    })
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Desea <strong>Eliminar</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.clicBotonBorrar();
          },
        },
      ],
    });
    await alert.present();
  }

}
