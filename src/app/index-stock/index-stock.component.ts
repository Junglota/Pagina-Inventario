import { Component,OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { RequestsService } from '../requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-stock',
  templateUrl: './index-stock.component.html',
  styleUrls: ['./index-stock.component.css']
})
export class IndexStockComponent implements OnInit{
  productos: any[] = [];
  xproductos: any[] = [];
  sessionInfo:any;
  pageSlice:any = this.productos.slice(0,10);

  constructor(private requestsService:RequestsService){}

  ngOnInit(){
    this.cargarStock()
  }

  async cargarStock(){
    (await this.requestsService.get('Inventarios')).subscribe(
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

  editarStock(stock:any){
    Swal.fire({
      title: 'Editar inventario',
      html: `<div class="form-group">
      <label for="nombre">Nombre de producto:</label>
      <input type="text" id="nombre" name="nombre" value=${stock.intId} required disabled>
    </div>
    <div class="form-group">
      <label for="intId">Codigo:</label>
      <input type="text" id="intId" name="intId" value=${stock.idProducto} required disabled>
    </div>
    <div class="form-group">
      <label for="stock">Stock:</label>
      <input type="text" id="stock" name="stock" value=${ stock.stock} required>
    </div>
    <div class="form-group">
      <label for="stockMinimo">Stock Minimo:</label>
      <input type="text" id="stockMinimo" name="stockMinimo" value=${ stock.stockMinimo} required>
    </div>
    <div class="form-group">
      <label for="correo">Id de Tienda:</label>
      <input type="text" id="idTienda" name="idTienda" value=${stock.idTienda} required disabled>
    </div>`,
      confirmButtonText: 'Modificar Producto',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        //const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const intId = stock.intId;
        const idProducto = Swal.getPopup()?.querySelector<any>('#intId').value;
        const cantidad = Swal.getPopup()?.querySelector<any>('#stock').value;
        const stockMinimo = Swal.getPopup()?.querySelector<any>('#stockMinimo').value;
        const idTienda = Swal.getPopup()?.querySelector<any>('#idTienda').value;
        if (/*!nombre ||*/ !idProducto|| !cantidad|| !stockMinimo || !idTienda) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          /* nombre: nombre, */
          intId: stock.intId,
          idProducto: idProducto,
          stockMinimo: Number(stockMinimo),
          stock: Number(cantidad),
          idTienda: Number(idTienda)
        }
      }
    }).then(async (result) => {
      //Mandar usuario a la base de datos si todo correcto
      console.log(result);
      if(result.isConfirmed){
        (await this.requestsService.put('Inventarios/' + stock.intId, result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.cargarStock();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo producto:', error);
          }
        );
      }

    })
  }

  async eliminarStock(idStock:any){
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
        (await this.requestsService.delete('Inventarios/' + idStock)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de eliminar uno
            Swal.fire(
              'Eliminado!',
              'El registro fue eliminado.',
              'success'
            )
            this.cargarStock();
          },
          (error: any) => {
            console.error('Error al eliminar el registro:', error);
          }
        );
      }
    })
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
}
