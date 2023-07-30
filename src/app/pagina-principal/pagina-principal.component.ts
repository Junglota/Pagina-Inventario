import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm} from '@angular/forms';
import Swal from 'sweetalert2';
import { TYPE } from './values.constants';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';

//import { LoginService } from '../login.service';

@Component({
  selector: 'app-pagina-principal',
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent{
  endpoint:string = "Login"

  Name:any="";

  constructor(private request:RequestsService,private Router:Router){}


  async login(form:NgForm){

    const body={
      username:`${form.value.user}`,
      password:`${form.value.password}`
    };

    (await this.request.login(body,this.endpoint)).subscribe(response =>{
      if ( response.jwtToken) {

        Swal.fire({
          toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: TYPE.SUCCESS,
        timerProgressBar:false,
        timer: 5000,
        title: 'Signed in successfully'

        })
          localStorage.setItem('response',JSON.stringify(response))
          console.log(localStorage.getItem('response'))
          //------------------------------------------------------
          const datax : any = localStorage.getItem('response');
          const data = JSON.parse(datax);
          console.log(data.correo);
          //-------------------------------------------------------
          this.Router.navigate(['/dash'])
      }
      else{
        console.log("incorrecto")
        Swal.fire({
          toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: TYPE.ERROR,
        timerProgressBar:false,
        timer: 5000,
        title: 'Usuario o contraseña incorrectos'
        })
      }
    });
  }
}
