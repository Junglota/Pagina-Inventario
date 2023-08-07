import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',


styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    contrasena: '',
    repetirContrasena: ''
  };

  isLoading = false;

  constructor(private request: RequestsService, private router: Router) {}

    async registro(form:NgForm) {
      const body = {
        nombre: form.value.nombre,
        apellido: form.value.apellido,
        username: form.value.usuario,
        correo: form.value.correo,
        password: form.value.password,
        localidad: form.value.localidad
      };
      console.log(body);
    if (form.value.password === form.value.retrypassword) {
      if (this.validarContrasena(form.value.retrypassword)) {
        this.isLoading = true;





        (await this.request.signup(body,'Login/Registro')).subscribe((response) => {
            this.isLoading = false;
            Swal.fire({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              icon: 'success',
              timerProgressBar: false,
              timer: 5000,
              title: 'Usuario registrado exitosamente'
            });
            this.router.navigate(['/login']);
          },
          error => {
            this.isLoading = false;
            Swal.fire({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              icon: 'error',
              timerProgressBar: false,
              timer: 5000,
              title: 'Error al registrar usuario'
            });
          }
        );

      } else {
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: 'error',
          timerProgressBar: false,
          timer: 5000,
          title: 'La contraseña debe de contener algun caracter especial'
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
        title: 'Las contraseñas no coinciden.'
      });
    }
  }

  private validarContrasena(contrasena: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    console.log(regex.test(contrasena));

    return regex.test(contrasena);
  }
}
