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
        (await this.request.post('Login/updatemail', body)).subscribe((response)=>{
          this.isLoading = false;

        if (response) {
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'success',
            timerProgressBar: false,
            timer: 5000,
            title: 'Cuenta de Gmail configurada exitosamente'
          });
        } else {
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'error',
            timerProgressBar: false,
            timer: 5000,
            title: 'La contraseña actual no es válida o el correo de Gmail ya está en uso.'
          });
        }
        });

      } catch (error) {
        this.isLoading = false;
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: 'error',
          timerProgressBar: false,
          timer: 5000,
          title: 'Error al configurar la cuenta de Gmail'
        });
      }
    } else {
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: 'error',
        timerProgressBar: false,
        timer: 5000,
        title: 'Por favor, ingresa el nuevo correo de Gmail y la contraseña actual.'
      });
    }
  }
  }

  /* async cambiarContrasena(form: NgForm) {
    if (
      this.usuario.contrasenaActual &&
      this.usuario.nuevaContrasena &&
      this.usuario.repetirNuevaContrasena
    ) {
      if (this.usuario.nuevaContrasena === this.usuario.repetirNuevaContrasena) {
        this.isLoading = true;

        const body = {
          contrasenaActual: this.usuario.contrasenaActual,
          nuevaContrasena: this.usuario.nuevaContrasena
        };

        try {
          await this.request.patch('CambiarContrasena', body);
          this.isLoading = false;
          this.mostrarMensajeExitoso('Contraseña cambiada exitosamente');
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
} */
