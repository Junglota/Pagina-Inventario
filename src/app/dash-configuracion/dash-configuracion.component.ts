import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { RequestsService } from '../requests.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-configuracion',
  templateUrl: './dash-configuracion.component.html',
  styleUrls: ['./dash-configuracion.component.css']
})
export class DashConfiguracionComponent {
  sessionData = this.request.getSessionInfo();

  isLoading = false;

  constructor(private request: RequestsService, private router: Router) {}

  async configurarGmail(form: NgForm) {

    if (form.value.correoGmail && form.value.contrasenaActual) {
      this.isLoading = true;

      const body = {
        correo : this.sessionData.correo,
        newCorreo: form.value.correoGmail,
        password: form.value.contrasenaActual
      };
      console.log(body);

      try {
        (await this.request.postNoAuth('Login/updatemail', body)).subscribe((response)=>{
          this.isLoading = false;
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'success',
            timerProgressBar: false,
            timer: 5000,
            title: 'Cuenta de Gmail configurada exitosamente'
          });
        })
      } catch(error){
        this.isLoading = false;
        this.mostrarMensajeError('Error al cambiar el correo');
      }
    }
  }

  async cambiarContrasena(form: NgForm) {
    if (
      form.value.contrasenaActual &&
      form.value.nuevaContrasena &&
      form.value.repetirNuevaContrasena
    ) {
      if (form.value.nuevaContrasena === form.value.repetirNuevaContrasena) {
        this.isLoading = true;

        const body = {
          correo: this.sessionData.correo,
          password: form.value.contrasenaActual,
          newPassword: form.value.nuevaContrasena
        };

        try {
          await (await this.request.postNoAuth('Login/updatepassword', body)).subscribe((response)=>{
            this.isLoading = false;
          this.mostrarMensajeExitoso('Contraseña cambiada exitosamente, por favor vuelva a iniciar sesion');
          this.cerrarSesion();
          })
        } catch (error) {
          this.isLoading = false;
          this.mostrarMensajeError('Error al cambiar la contraseña');
        }
      } else {
        this.mostrarMensajeError('Las contraseñas nuevas no coinciden.');
      }
    } else {
      this.mostrarMensajeError('Por favor, ingresa todas las contraseñas.');
    }
  }

  private mostrarMensajeExitoso(mensaje: string) {
    this.mostrarMensaje(mensaje, 'success');
  }

  private mostrarMensajeError(mensaje: string) {
    this.mostrarMensaje(mensaje, 'error');
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: tipo,
      timerProgressBar: false,
      timer: 5000,
      title: mensaje
    });
  }

  private validarContrasena(contrasena: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(contrasena);
  }

  cerrarSesion(){
    localStorage.clear();
    this.router.navigate([''])
  }
}




