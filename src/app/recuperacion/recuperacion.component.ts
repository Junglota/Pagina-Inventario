import { Component } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TYPE } from '../pagina-principal/values.constants';
import Swal from 'sweetalert2';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.css']
})
export class RecuperacionComponent {
  endpoint:string='Login/resetpassword';



  constructor(private router:ActivatedRoute, private route: Router, private requestsService:RequestsService){}

  async changePassword(form:NgForm){
    let eToken:any = localStorage.getItem('eToken');
    if(eToken !== null){
      eToken = JSON.parse(eToken);
    }
    if(form.value.password === form.value.confirmPassword){
      const body ={
        newPassword : form.value.confirmPassword,
        eToken : eToken.eToken
      };
      console.log(body);

      (await this.requestsService.post(this.endpoint,body)).subscribe(
        (data: any) => {
        Swal.fire({
          toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: TYPE.SUCCESS,
        timerProgressBar:false,
        timer: 5000,
        title: 'Contraseña actualizada, por favor inicia sesion'
        });
        this.route.navigate(['']);
      },(error:any) =>{
        //codigo de error handling si lo hago
      }
      )
    }
    else{
      Swal.fire({
        toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: TYPE.WARNING,
      timerProgressBar:false,
      timer: 5000,
      title: 'Las contraseñas deben de coincidir'
      })
    }
  }

}
