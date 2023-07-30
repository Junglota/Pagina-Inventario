import { Component, OnInit,PipeTransform,Pipe, ViewChild } from '@angular/core';
import { RequestsService } from '../requests.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dash-product',
  templateUrl: './dash-product.component.html',
  styleUrls: ['./dash-product.component.css']
})
export class DashProductComponent implements OnInit{

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  productos: any[] = [];
  xproductos: any[] = [];
  sessionInfo:any;
  pageSlice:any = this.productos.slice(0,10);

  constructor(private requestsService:RequestsService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.cargarProductos();

      try {
        this.sessionInfo = this.requestsService.getSessionInfo();
      } catch (error) {
        //implementar error handling
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

  async cargarProductos(){
    (await this.requestsService.get('Productos')).subscribe(
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

  async agregarProducto(){
    Swal.fire({
      title: 'Agregar producto',
      html: `<div class="form-group">
      <label for="nombre">Nombre de producto:</label>
      <input type="text" id="nombre" name="nombre" required>
    </div>
    <div class="form-group">
      <label for="intId">Codigo:</label>
      <input type="text" id="intId" name="intId" required>
    </div>
    <div class="form-group">
      <label for="categoria">Categoria:</label>
      <input type="text" id="categoria" name="categoria" required>
    </div>
    <div class="form-group">
      <label for="precio">Precio:</label>
      <input type="text" id="precio" name="precio" required>
    </div>
    <div class="form-group">
      <label for="correo">Id de Tienda:</label>
      <input type="text" id="idTienda" name="idTienda" required>
    </div>`,
      confirmButtonText: 'Crear Producto',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const intId = Swal.getPopup()?.querySelector<any>('#intId').value;
        const categoria = Swal.getPopup()?.querySelector<any>('#categoria').value;
        const precio = Swal.getPopup()?.querySelector<any>('#precio').value;
        const idTienda = Swal.getPopup()?.querySelector<any>('#idTienda').value;
        if (!nombre || !intId|| !categoria|| !precio || !idTienda) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          nombre: nombre,
          IdProducto: intId,
          categoria: categoria,
          precio: Number(precio),
          idTienda: Number(idTienda)
        }
      }
    }).then(async (result) => {
      console.log(result);
      //Mandar usuario a la base de datos si todo correcto
      if(result.isConfirmed){
        (await this.requestsService.post('Productos', result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.cargarProductos();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo usuario:', error);
          }
        );
      }

    })
  }

  async editarProducto(producto:any){
    Swal.fire({
      title: 'Editar Producto',
      html: `<div class="form-group">
      <label for="nombre">Nombre de producto:</label>
      <input type="text" id="nombre" name="nombre" value=${producto.nombre} required>
    </div>
    <div class="form-group">
      <label for="intId">Codigo:</label>
      <input type="text" id="intId" name="intId" value=${producto.idProducto} required>
    </div>
    <div class="form-group">
      <label for="categoria">Categoria:</label>
      <input type="text" id="categoria" name="categoria" value=${producto.categoria} required>
    </div>
    <div class="form-group">
      <label for="precio">Precio:</label>
      <input type="text" id="precio" name="precio" value=${producto.precio} required>
    </div>
    <div class="form-group">
      <label for="correo">Id de Tienda:</label>
      <input type="text" id="idTienda" name="idTienda" value=${producto.idTienda} required>
    </div>`,
      confirmButtonText: 'Modificar Producto',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const intId = Swal.getPopup()?.querySelector<any>('#intId').value;
        const categoria = Swal.getPopup()?.querySelector<any>('#categoria').value;
        const precio = Swal.getPopup()?.querySelector<any>('#precio').value;
        const idTienda = Swal.getPopup()?.querySelector<any>('#idTienda').value;
        if (!nombre || !intId|| !categoria|| !precio || !idTienda) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          nombre: nombre,
          idProducto: intId,
          categoria: categoria,
          precio: Number(precio),
          idTienda: Number(idTienda)
        }
      }
    }).then(async (result) => {
      //Mandar usuario a la base de datos si todo correcto
      console.log(result);
      if(result.isConfirmed){
        (await this.requestsService.put('Productos/' + producto.idProducto, result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.cargarProductos();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo producto:', error);
          }
        );
      }

    })
  }

  async eliminarProducto(idProducto:any){
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
        (await this.requestsService.delete('Productos/' + idProducto)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de eliminar uno
            Swal.fire(
              'Eliminado!',
              'Su producto fue eliminado.',
              'success'
            )
            this.cargarProductos();
          },
          (error: any) => {
            console.error('Error al eliminar el producto:', error);
          }
        );
      }
    })
  }

  buscarProductos(busqueda: string): void {
    console.log(busqueda)
    let resultados:any
    resultados = this.productos.filter((val) =>
      val && val.nombre && val.nombre.toLowerCase().includes(busqueda)
    );
    this.pageSlice = resultados.slice(0,10)
    console.log(resultados)
    console.log(this.pageSlice)
  }

}
