import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  ngOnInit() {
    if(localStorage.getItem('response')){
    const datax : any = localStorage.getItem('response');
    const data = JSON.parse(datax);
    this.nombreUsuario = data.username;
    }
  }
  nombreUsuario:any;

  constructor(){}

  //Boton de salir abre un form por ejemplo
  form(){
    Swal.fire({
      title:"Form",
      html: `<input type="text" id="login" class="swal2-input" placeholder="Nombre de producto">
      <input type="text" id="password" class="swal2-input" placeholder="Cantidad"><input type="text" id="password" class="swal2-input" placeholder="Categoria">`,
      confirmButtonText: 'Sign in',
  focusConfirm: false,
  preConfirm: () => {
  }
    })
  }

}
