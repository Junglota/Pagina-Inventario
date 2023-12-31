import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-user',
  templateUrl: './dash-user.component.html',
  styleUrls: ['./dash-user.component.css']
})
export class DashUserComponent implements OnInit {
  usuarios: any[] = []; // Variable para almacenar la lista de usuarios
  pageSlice:any = this.usuarios.slice(0,10);
  xproductos: any[] = [];

  constructor(private requestsService: RequestsService, private router:Router) { }

  ngOnInit(): void {
    try {
      this.requestsService.checkSession();
    // Obtener la lista de usuarios al cargar el componente
    this.getUsuarios();
    } catch (error) {

    }
  }

  // Función para obtener la lista de usuarios desde el servicio
  async getUsuarios() {
    (await this.requestsService.get('Usuarios')).subscribe(
      (data: any[]) => {
        // Almacenar la lista de usuarios en la variable 'usuarios'
        this.usuarios = data;
        this.xproductos = this.usuarios;
        this.pageSlice = this.xproductos.slice(0,10);
        console.log(this.usuarios);

      },
      (error: any) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  // Función para agregar un nuevo usuario
  async agregarUsuario() {
    Swal.fire({
      title: 'Agregar usuario',
      html: `<div class="form-group">
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" name="nombre" required>
    </div>
    <div class="form-group">
      <label for="apellido">Apellido:</label>
      <input type="text" id="apellido" name="apellido" required>
    </div>
    <div class="form-group">
      <label for="usuario">Usuario:</label>
      <input type="text" id="usuario" name="usuario" required>
    </div>
    <div class="form-group">
      <label for="contraseña">Contraseña:</label>
      <input type="text" id="password" name="password" required>
    </div>
    <div class="form-group">
      <label for="correo">Correo:</label>
      <input type="email" id="correo" name="correo" required>
    </div>
    <div class="form-group">
      <label for="idTienda">Id Tienda:</label>
      <input type="text" id="idTienda" name="idTienda" required>
    </div>
    <div class="form-group">
      <label for="permiso">Permiso:</label>
      <select id="permiso" name="permiso" required>
        <option value="" disabled selected>-- Seleccione --</option>
        <option value="1">Admin</option>
        <option value="2">Propietario</option>
        <option value="3">Empleado</option>
      </select>
    </div>`,
      confirmButtonText: 'Crear Usuario',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const apellido = Swal.getPopup()?.querySelector<any>('#apellido').value;
        const usuario = Swal.getPopup()?.querySelector<any>('#usuario').value;
        const contraseña = Swal.getPopup()?.querySelector<any>('#password').value;
        const correo = Swal.getPopup()?.querySelector<any>('#correo').value;
        const permiso = Swal.getPopup()?.querySelector<any>('#permiso').value;
        const idTienda = Swal.getPopup()?.querySelector<any>('#idTienda').value;
        if (!nombre || !apellido|| !usuario|| !contraseña || !correo || !permiso) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          nombre: nombre,
          apellido: apellido,
          username: usuario,
          password: contraseña,
          correo: correo,
          userType: Number(permiso),
          idTienda: Number(idTienda),
        }
      }
    }).then(async (result) => {
      //Mandar usuario a la base de datos si todo correcto
      if(result.isConfirmed){
        (await this.requestsService.post('Usuarios', result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.getUsuarios();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo usuario:', error);
          }
        );
      }

    })






    /*const newUser = {
      nombre: nombre,
      apellido: apellido,
      usuario: usuario,
      correo: correo,
      permiso: permiso
    };

    */
  }

  // Función para eliminar un usuario
  async eliminarUsuario(id: number,estado:number) {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Se ${(estado == 1)?'desactivara':'activara'} la cuenta, desea continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        (await this.requestsService.delete('Usuarios/' + id)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de eliminar uno
            Swal.fire(
              `${(estado == 1)?'Desactivado':'Activado'}`,
              `La cuenta fue ${(estado == 1)?'desactivada':'activada'}` ,
              'success'
            )
            this.getUsuarios();
          },
          (error: any) => {
            console.error('Error al eliminar el usuario:', error);
          }
        );
      }
    })
  }

  // Función para editar un usuario
  async editarUsuario(user:any) {
    Swal.fire({
      title: 'Editar Usuario',
      html: `<div class="form-group">
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" name="nombre" value=${user.nombre} required>
    </div>
    <div class="form-group">
      <label for="apellido">Apellido:</label>
      <input type="text" id="apellido" name="apellido" value=${user.apellido} required>
    </div>
    <div class="form-group">
      <label for="usuario">Usuario:</label>
      <input type="text" id="usuario" name="usuario" value=${user.username} required>
    </div>
    <div class="form-group">
      <label for="correo">Correo:</label>
      <input type="email" id="correo" name="correo" value=${user.correo} required>
    </div>
    <div class="form-group">
      <label for="idTienda">Id Tienda:</label>
      <input type="text" id="idTienda" name="idTienda" value=${user.idTienda} required>
    </div>
    <div class="form-group">
      <label for="permiso">Permiso:</label>
      <select id="permiso" name="permiso" required>
        <option value="" disabled selected>-- Seleccione --</option>
        <option value="1" ${user.userType === 1 ? 'selected' : ''}>Admin</option>
        <option value="2" ${user.userType === 2 ? 'selected' : ''}>Propietario</option>
        <option value="3" ${user.userType === 3 ? 'selected' : ''}>Empleado</option>
      </select>
    </div>`,
      confirmButtonText: 'Modificar Usuario',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const apellido = Swal.getPopup()?.querySelector<any>('#apellido').value;
        const usuario = Swal.getPopup()?.querySelector<any>('#usuario').value;
        const correo = Swal.getPopup()?.querySelector<any>('#correo').value;
        const permiso = Swal.getPopup()?.querySelector<any>('#permiso').value;
        const idTienda = Swal.getPopup()?.querySelector<any>('#idTienda').value;
        if (!nombre || !apellido|| !usuario || !correo || !permiso) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          intId : user.intId,
          nombre: nombre,
          apellido: apellido,
          username: usuario,
          password: user.password,
          correo: correo,
          userType: Number(permiso),
          idTienda: Number(idTienda),
          estado: user.estado
        }
      }
    }).then(async (result) => {
      //Mandar usuario a la base de datos si todo correcto
      if(result.isConfirmed){
        (await this.requestsService.put('Usuarios/' + user.intId, result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.getUsuarios();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo usuario:', error);
          }
        );
      }

    })
  }

// busca los usuarios por nombre
  buscarUsuarios(busqueda: string): void {
    console.log(busqueda)
    let resultados:any
    resultados = this.usuarios.filter((val) =>
      val && val.nombre && val.nombre.toLowerCase().includes(busqueda)
    );
    this.pageSlice = resultados.slice(0,10)
    console.log(resultados)
    console.log(this.pageSlice)
  }


  getPermisoText(userType:any){
    switch(userType){
      case 1: return "Admin"
      case 2: return "Propietario"
      case 3: return "Empleado"
      default: return "Error"
    }
  }

  cerrarSesion(){
    localStorage.clear();
    this.router.navigate([''])
  }
}
