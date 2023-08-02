import { Component } from '@angular/core';
import { RequestsService } from '../requests.service';
import {TYPE} from '../pagina-principal/values.constants'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  input:any;
  endpoint:string = 'Login/forgotpassword'

  pagText:string = "Olvidé mi contraseña";
  pagPlaceholder:string = 'Escribe tu correo';
  pagButton:string = 'Enviar correo';
  correoNoEnviado:boolean = true;

  constructor(private requestsService:RequestsService, private router:Router){}

  async enviarCorreo(){
    let body = {
      correo: `${this.input}`
    };
    console.log(body);

    (await this.requestsService.post(this.endpoint,body)).subscribe(
      (data: any) => {
        if(this.correoNoEnviado){
          Swal.fire({
            toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: TYPE.SUCCESS,
          timerProgressBar:false,
          timer: 5000,
          title: 'Correo de verificacion enviado'
          })
          this.pagText = 'Ingrese el codigo de verificacion';
          this.input = null;
          this.pagPlaceholder = 'Codigo de verificacion';
          this.pagButton = 'Enviar Codigo';
          this.correoNoEnviado = false;
          //this.endpoint = *endpointporcrear*
        }else{
          this.router.navigate(['/recuperacion'],data)
        }
      },
      (error: any) => {
        if(this.correoNoEnviado){
          Swal.fire({
            toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: TYPE.ERROR,
          timerProgressBar:false,
          timer: 5000,
          title: 'Correo no encontrado'

          })
        }
        else{
          Swal.fire({
            toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: TYPE.ERROR,
          timerProgressBar:false,
          timer: 5000,
          title: 'Codigo de verificacion incorrecto'

          })
        }
      }
    )
  }

}
