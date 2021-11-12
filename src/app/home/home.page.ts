import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Tarea } from '../tarea';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tareaEditando: Tarea;

  constructor(private firestoreService: FirestoreService) {
    //Crear una tarea vacía al empezar
    this.tareaEditando = {} as Tarea;
  }
  clickBotonInsertar() {
    this.firestoreService.insertar("tareas", this.tareaEditando)
    .then(() =>{
      console.log("Tarea creada correctamente")
      // Limpiar el contenido de la tarea que se estaba editando
      this.tareaEditando = {} as Tarea;
    }, (error) => {
      console.error(error);
    });

  }
}
