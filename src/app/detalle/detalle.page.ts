import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Router } from '@angular/router';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  imagenTempSrc: String;

  subirArchivoImagen: boolean = false;
  borrarArchivoImagen: boolean = false;

  // Nombre de la colección en Firestore Database
  // coleccion: String = "EjemploImagenes";
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
     private router: Router,
     private socialSharing: SocialSharing) { 

      // this.document.id = "ID_ImagenDePrueba";
      // this.ngOnInit();
     }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.firestoreService.consultarPorId("tareas", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        this.imagenTempSrc = this.document.data.imagen;
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.titulo);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Tarea;
        
      } 
    });
  }

  clicBotonBorrar() {
    
    this.firestoreService.borrar("tareas", this.id).then(() => {
      // Actualizar la lista completa
      this.ngOnInit();
      // Limpiar datos de pantalla
      this.document.data = {} as Tarea;
    })
    this.borrarImagen();
    this.clicVolver();
  }

  clickBotonInsertar() {
    //this.insertarDatos();
    console.log(this.document.data);
    this.firestoreService.insertar("tareas", this.document.data)
    .then(() =>{
      
      console.log("Tarea creada correctamente")
      // Limpiar el contenido de la tarea que se estaba editando
      this.document.data = {} as Tarea;
    }, (error) => {
      console.error(error);
    });

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
  clicInformacion() {
    
    this.router.navigate(['/informacion']);
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

  async compartir(){
this.socialSharing.share("Nombre: " + this.document.data.procesador + "\n" + "Núcleos: " + this.document.data.nucleos + "\n" + "Hilos: "
 + this.document.data.hilos + "\n" + "Precio: " + this.document.data.precio + "\n" + "Hercios: " + this.document.data.hercios
 + "\n" + "Imagen: " + this.imagenTempSrc,
  'Procesador', ['']).then(() => {
  // Success!
}).catch(() => {
  // Error!
});
  }

  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              if(results.length > 0) { // Si el usuario ha elegido alguna imagen
                this.imagenTempSrc = "data:image/jpeg;base64,"+results[0];
                console.log("Imagen que se ha seleccionado (en Base64): " + this.imagenTempSrc);
                // Se informa que se ha cambiado para que se suba la imagen cuando se actualice la BD
                this.subirArchivoImagen = true;
                this.borrarArchivoImagen = false;
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  public guardarDatos() {
    if(this.subirArchivoImagen) {
      // Si la imagen es nueva se sube como archivo y se actualiza la BD
      if(this.document.data.imagenURL != null){
        this.eliminarArchivo(this.document.data.imagen);
      }
      this.subirImagenActualizandoBD(false);
    } else {
      if(this.borrarArchivoImagen) {
        this.eliminarArchivo(this.document.data.imagen);        
        this.document.data.imagen = null;
      }
      // Si no ha cambiado la imagen no se sube como archivo, sólo se actualiza la BD
      this.actualizarBaseDatos();
    }
    
  } 
  async insertarDatos() {
    if(this.subirArchivoImagen) {
      // Si la imagen es nueva se sube como archivo y se actualiza la BD
      if(this.document.data.imagenURL != null){
        await this.eliminarArchivo(this.document.data.imagen);
      }
      this.document.data.imagen = await this.subirImagenActualizandoBD(true);
    } else {
      if(this.borrarArchivoImagen) {
       await this.eliminarArchivo(this.document.data.imagen);        
        this.document.data.imagen = null;
      }
      // Si no ha cambiado la imagen no se sube como archivo, sólo se actualiza la BD
      
    }
    
  }
  async subirImagenActualizandoBD(nuevo:boolean){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    // Carpeta del Storage donde se almacenará la imagen
    let nombreCarpeta = "imagenes";

    // Mostrar el mensaje de espera
    loading.present();
    // Asignar el nombre de la imagen en función de la hora actual para
    //  evitar duplicidades de nombres         
    let nombreImagen = `${new Date().getTime()}`;
    // Llamar al método que sube la imagen al Storage
    this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, this.imagenTempSrc)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            // En la variable downloadURL se tiene la dirección de descarga de la imagen
            console.log("downloadURL:" + downloadURL);
            //this.document.data.imagenURL = downloadURL;            
            // Mostrar el mensaje de finalización de la subida
            toast.present();
            // Ocultar mensaje de espera
            loading.dismiss();

            // Una vez que se ha termninado la subida de la imagen 
            //    se actualizan los datos en la BD
            this.document.data.imagen = downloadURL;
            console.log(this.document.data);
            if (nuevo){
              this.clickBotonInsertar();
            } else{
              this.actualizarBaseDatos();
            }
            
            //this.actualizarBaseDatos();
          })
      })    
  } 

  public borrarImagen() {
    // No mostrar ninguna imagen en la página
    this.imagenTempSrc = null;
    // Se informa que no se debe subir ninguna imagen cuando se actualice la BD
    this.subirArchivoImagen = false;
    this.borrarArchivoImagen = true;
  }

  async eliminarArchivo(fileURL) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }

  private actualizarBaseDatos() {    
    console.log("Guardando en la BD: ");
    console.log(this.document.data);
    this.firestoreService.actualizar("tareas", this.document.id, this.document.data);
  }

}


