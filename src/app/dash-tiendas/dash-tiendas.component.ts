import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RequestsService } from '../requests.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dash-tiendas',
  templateUrl: './dash-tiendas.component.html',
  styleUrls: ['./dash-tiendas.component.css']
})
export class DashTiendasComponent {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  productos: any[] = [];
  xproductos: any[] = [];
  sessionInfo:any;
  pageSlice:any = this.productos.slice(0,10);
  sessionData = this.requestsService.getSessionInfo();
  endpoint:string = 'Tiendums';
  inputTienda:boolean = this.sessionData.userType == 1? true:false;

  constructor(private requestsService:RequestsService, private cdr: ChangeDetectorRef, private router:Router){}

  ngOnInit(): void {
    try {
      this.requestsService.checkSession();
    this.cargarTiendas();
    } catch (error) {

    }
  }


  Paginacion(event:PageEvent){
    console.log(event)
    const index = event.pageIndex * event.pageSize;
    let endIndex = index + event.pageSize;
    if(endIndex > this.xproductos.length){
      endIndex = this.xproductos.length;
    }
    this.pageSlice = this.xproductos.slice(index,endIndex);
  }

  async cargarTiendas(){
    (await this.requestsService.get(this.endpoint)).subscribe(
      (data: any[]) => {
        // Almacenar la lista de usuarios en la variable 'usuarios'
        this.productos = data;
        this.xproductos = this.productos;
        this.pageSlice = this.xproductos.slice(0,10);
        console.log(this.pageSlice)
      },
      (error: any) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  async agregarTienda(){
    let htmlModal = `<div class="form-group">
    <label for="nombre">Nombre de la tienda:</label>
    <input type="text" id="nombre" name="nombre" required>
  </div>
  <div class="form-group">
    <label for="intId">Codigo del propietario:</label>
    <input type="text" id="intId" name="intId" required>
  </div>`;

    Swal.fire({
      title: 'Agregar Tienda',
      html: htmlModal,
      confirmButtonText: 'Crear Tienda',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const intId = Swal.getPopup()?.querySelector<any>('#intId').value;
        if (!nombre || !intId) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          localidad: nombre,
          idPropietario: Number(intId),
        }
      }
    }).then(async (result) => {
      console.log(result);
      //Mandar usuario a la base de datos si todo correcto
      if(result.isConfirmed){
        (await this.requestsService.post('Tiendums', result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.cargarTiendas();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo usuario:', error);
          }
        )
      }

    })
  }

  async editarTiendas(tienda:any){
    let htmlModal = `<div class="form-group">
    <label for="nombre">Nombre de la tienda:</label>
    <input type="text" id="nombre" name="nombre" value=${tienda.localidad} required>
  </div>
  <div class="form-group">
    <label for="intId">Codigo del propietario:</label>
    <input type="text" id="intId" name="intId" value=${tienda.idPropietario} required>
  </div>`;

    Swal.fire({
      title: 'Editar Tienda',
      html: htmlModal,
      confirmButtonText: 'Modificar Tienda',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const intId = Swal.getPopup()?.querySelector<any>('#intId').value;
        if (!nombre || !intId) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          intId: tienda.intId,
          localidad: nombre,
          idPropietario: intId
        }
      }
    }).then(async (result) => {
      //Mandar usuario a la base de datos si todo correcto
      console.log(result);
      if(result.isConfirmed){
        (await this.requestsService.put('Tiendums/' + tienda.intId, result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.cargarTiendas();
          },
          (error: any) => {
            console.error('Error al agregar una nueva tienda:', error);
          }
        );
      }

    })
  }

  async eliminarTienda(idProducto:any){
    Swal.fire({
      title: 'Estas seguro?',
      text: "Eliminar es una accion irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        (await this.requestsService.delete('Tiendums/' + idProducto)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de eliminar uno
            Swal.fire(
              'Eliminado!',
              'La tienda fue eliminado.',
              'success'
            )
            this.cargarTiendas();
          },
          (error: any) => {
            console.error('Error al eliminar la tienda:', error);
          }
        );
      }
    })
  }

  buscarTiendas(busqueda: string): void {
    console.log(busqueda)
    let resultados:any
    resultados = this.productos.filter((val) =>
      val && val.localidad && val.localidad.toLowerCase().includes(busqueda)
    );
    this.pageSlice = resultados.slice(0,10)
    console.log(resultados)
    console.log(this.pageSlice)
  }

  cerrarSesion(){
    localStorage.clear();
    this.router.navigate([''])
  }
}
