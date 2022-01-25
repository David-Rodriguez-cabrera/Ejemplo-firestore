import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Router } from '@angular/router';
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

  constructor(private firestoreService: FirestoreService, 
    private activateRoute: ActivatedRoute,
     public alertController: AlertController,
     private loadingController: LoadingController,
     private toastController: ToastController,
     private imagePicker: ImagePicker, 
     private router: Router) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.firestoreService.consultarPorId("tareas", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        //console.log(this.document.data.imagen);
      //   if (this.document.data.imagen == undefined){
      //   this.document.data.imagen = 'https://canalcocina.es/medias/_cache/zoom-cfb51745176980ddf03e20382b32760d-920-518.jpg'; 
      // }
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
    this.router.navigate(['/home']);
  }
  clicVolver() {
    
    this.router.navigate(['/home']);
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cuidado!',
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

  async uploadImagePicker() {
    console.log("patata");
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    // Comprobar si la aplicación tiene permisos de lectura
    console.log("patata2");
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
          console.log("patata3");
        }
        
        // Abrir selector de imágenes (ImagePicker)
        else {
          console.log("patata4");
          this.imagePicker.getPictures ({
            maximumImagesCount: 1, // Permitir sólo 1 imagen
            outputType: 1 // 1 = Base 64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              // Carpeta del Storage donde se almacenará la imagen
              let nombreCarpeta = "imagenes";
              // Recorrer todas las imágenes que haya seleccionado el usuario
              // aunque realmente sólo será 1 como se ha indicado en las opciones
              console.log(results.length);
              for (var i = 0; i < results.length; i++){
                // Mostrar el mensaje de espera
                loading.present();
                // Asignar el nombre de la imagen en función de la hora actual para
                // evitar duplicidades de nombres
                let nombreImagen = `${new Date().getTime()}`;
                // Llamar al método que sube la imagen al Storage
                console.log("patatafin");
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen,
                  results[i])
                              .then(snapshot =>{
                                snapshot.ref.getDownloadURL()
                                  .then(downloadUrl => {
                                    // En la variable downloadURL se tiene la dirección de descarga de la imagen
                                      console.log("downloadURL:" + downloadUrl);
                                      this.document.data.imagen = downloadUrl;  
                                      // Mostrar el mensaje de finalización de la subida
                                      toast.present();
                                      // Ocultar mensaje de espera
                                      loading .dismiss();
                                  })
                              })
                          
                          
              }

            },
            (err) => {
              console.log(err)
            }
          );
          }
        
        },
     (err) => {
        console.log(err);
      });
  }
async deleteFile(fileUrl){
  //this.document.data.imagen = null;
  const toast = await this.toastController.create({
    message: 'File was deleted successfully',
    duration: 3000
  });
  //this.document.data.imagen = fileUrl; 
  this.firestoreService.deleteFileFromURL(fileUrl)
    .then(() =>{
      this.document.data.imagen = null;
      toast.present();
    
    }, (err) => {
      console.log(err);
    });
}




}


