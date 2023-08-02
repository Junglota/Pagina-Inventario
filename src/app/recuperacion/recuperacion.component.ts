import { Component } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TYPE } from '../pagina-principal/values.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.css']
})
export class RecuperacionComponent {

  constructor(private router:ActivatedRoute){}

  changePassword(form:NgForm){
    if(form.value.password === form.value.confirmPassword){
      const body ={
        newPassword : form.value.confirmPassword,
        eToken : this.router.snapshot.paramMap.get('eToken')
      }

      /* Implementar post para cambiar la password */
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
