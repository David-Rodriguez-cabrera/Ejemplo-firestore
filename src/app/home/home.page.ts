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

  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Tarea
   }];

  idTareaSelec: string;

  

  constructor(private firestoreService: FirestoreService) {
    //Crear una tarea vacía al empezar
    this.tareaEditando = {} as Tarea;
    this.obtenerListaTareas();
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

  obtenerListaTareas(){
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas) => {
      this.arrayColeccionTareas = [];
      resultadoConsultaTareas.forEach((datosTarea: any) => {
        this.arrayColeccionTareas.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
      })
    });
  }

  selecTarea(tareaSelec) {
    console.log("Tarea seleccionada: ");
    console.log(tareaSelec);
    this.idTareaSelec = tareaSelec.id;
    
    this.tareaEditando.procesador = tareaSelec.data.procesador;
    this.tareaEditando.fecha = tareaSelec.data.fecha;
    this.tareaEditando.generacion = tareaSelec.data.generacion;
    this.tareaEditando.nucleos = tareaSelec.data.nucleos;
    this.tareaEditando.hercios = tareaSelec.data.hercios;
    this.tareaEditando.precio = tareaSelec.data.precio;
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("tareas", this.idTareaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("tareas", this.idTareaSelec, this.tareaEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
    })
  }

  
}
