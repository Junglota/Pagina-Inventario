////// dash-movimientos.component.ts
import { Component, OnInit } from '@angular/core';
//import { BarcodeScannerEnabledEvent } from 'ngx-barcode-scanner';
import { RequestsService } from '../requests.service';
import { Movimiento } from '../movimiento.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
//import {DashMovimientosComponent} from './dash-movimientos.component';

@Component({
  selector: 'app-dash-movimientos',
  templateUrl: './dash-movimientos.component.html',
  styleUrls: ['./dash-movimientos.component.css'],
})
export class DashMovimientosComponent implements OnInit{
  Movimientos: any[] = [];
  xproductos: any[] = [];
  sessionInfo:any;
  pageSlice:any = this.Movimientos.slice(0,10);

  constructor(private requestsService: RequestsService) {}

  ngOnInit(): void {
    this.requestsService.checkSession();
      this.cargarMovimientos();
  }

  async cargarMovimientos(){
    (await this.requestsService.get('Movimientos')).subscribe(
      (data: any[]) => {
        // Almacenar la lista de usuarios en la variable 'usuarios'
        this.Movimientos = data;
        this.xproductos = this.Movimientos;
        this.pageSlice = this.xproductos.slice(0,10);
        console.log(this.pageSlice)
      },
      (error: any) => {
        console.error('Error al obtener la lista de movimientos:', error);
      }
    );
  }

  async editarMovimiento(movimiento:any){
    Swal.fire({
      title: 'Editar Producto',
      html: `<div class="form-group">
      <label for="cantidad">Cantidad:</label>
      <input type="text" id="cantidad" name="cantidad" value=${movimiento.cantidad} required>
    </div>`,
      confirmButtonText: 'Modificar movimiento',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const cantidad = Swal.getPopup()?.querySelector<any>('#cantidad').value;
        if (!cantidad) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return [{
          op: "replace",
          path: "/Cantidad",
          value: cantidad,
        }]
      }
    }).then(async (result) => {
      //Mandar usuario a la base de datos si todo correcto
      console.log(result);
      if(result.isConfirmed){
        (await this.requestsService.patch('Movimientos/' + movimiento.intId, result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.cargarMovimientos();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo producto:', error);
          }
        );
      }

    })
  }

  async eliminarMovimiento(id:any){
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
        (await this.requestsService.delete('Movimientos/' + id)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de eliminar uno
            Swal.fire(
              'Eliminado!',
              'El movimiento fue eliminado.',
              'success'
            )
            this.cargarMovimientos();
          },
          (error: any) => {
            console.error('Error al eliminar el producto:', error);
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
 /* onScanSuccess(event: BarcodeScannerEnabledEvent): void {
    this.scannedCode = event.code;
    this.fetchMovimientoData();
  }*/

  /*fetchMovimientoData(): void {
    if (this.scannedCode) {
      this.requestsService.obtenerMovimientos().subscribe(
        (movimientos) => {
          this.movimientos = movimientos;
        },
        (error) => {
          console.error('Error al obtener los datos de los movimientos: ', error);
        }
      );
    }
  }*/
}
