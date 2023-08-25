////// dash-movimientos.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
//import { BarcodeScannerEnabledEvent } from 'ngx-barcode-scanner';
import { RequestsService } from '../requests.service';
import { Movimiento } from '../movimiento.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import {DashMovimientosComponent} from './dash-movimientos.component';
import * as XLSX from "xlsx";
import { NgFor } from '@angular/common';

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
  sessionData = this.requestsService.getSessionInfo();
  endpoint:string = this.sessionData.userType == 1? 'Movimientos': `Movimientos/tienda/${this.sessionData.idTienda}`;
  inputTienda:boolean = this.sessionData.userType == 1? true:false;
  tipoMovimiento:string='';
  public arrayBody:any[] = [{}];


  constructor(private requestsService: RequestsService, private router:Router) {}
  @ViewChild('fileImportInput', { static: false })
  fileImportInput!: ElementRef;
  ngOnInit(): void {
    this.requestsService.checkSession();
      this.cargarMovimientos();
  }

  async cargarMovimientos(){
    (await this.requestsService.get(this.endpoint)).subscribe(
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

  async agregarMovimiento(html?:string){
    let htmlModal = `<div class="form-group">
    <label for="fecha">Fecha:</label>
    <input type="date" id="fecha" name="nombre" required>
  </div>
  <div class="form-group">
    <label for="idProducto">Codigo del producto:</label>
    <input type="text" id="idProducto" name="idProducto" required>
  </div>
  <div class="form-group">
      <label for="tipoMovimiento">Tipo de movimiento:</label>
      <select id="tipoMovimiento" name="tipoMovimiento" required>
        <option value="" disabled selected>-- Seleccione --</option>
        <option value="E">Entrada de productos</option>
        <option value="S">Salida de productos</option>
      </select>
    </div>
    <div class="form-group">
      <label for="descripcion">Descripcion:</label>
      <select id="descripcion" name="descripcion" required>
        <option value="" disabled selected>-- Seleccione --</option>
        <option value="Compras">Compras</option>
        <option value="Dañados">Dañados</option>
        <option value="Traslado">Traslado</option>
        <option value="Ventas">Ventas</option>
      </select>
    </div>
  <div class="form-group">
    <label for="cantidad">Cantidad:</label>
    <input type="text" id="cantidad" name="cantidad" required>
  </div>`;
  if(this.inputTienda){
    htmlModal+= `
    <div class="form-group">
    <label for="idusuario">Usuario:</label>
    <input type="text" id="idusuario" name="idusuario" required>
  </div>
    <div class="form-group">
    <label for="idTienda">Id de Tienda:</label>
    <input type="text" id="idTienda" name="idTienda" required>
  </div>`
  }

    Swal.fire({
      title: 'Agregar movimiento',
      html: htmlModal,
      confirmButtonText: 'Crear Movimiento',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const fecha = Swal.getPopup()?.querySelector<any>('#fecha').value;
        const idProducto = Swal.getPopup()?.querySelector<any>('#idProducto').value;
        const cantidad = Swal.getPopup()?.querySelector<any>('#cantidad').value;
        const tipoMovimiento = Swal.getPopup()?.querySelector<any>('#tipoMovimiento').value;
        const descripcion = Swal.getPopup()?.querySelector<any>('#descripcion').value;
        const usuario = this.inputTienda? Swal.getPopup()?.querySelector<any>('#idusuario').value: this.sessionData.intId;
        const idTienda = this.inputTienda? Swal.getPopup()?.querySelector<any>('#idTienda').value: this.sessionData.idTienda;
        if (!fecha || !idProducto|| !cantidad|| !tipoMovimiento || !descripcion || !usuario || !idTienda) {
          Swal.showValidationMessage(`Completa todos los campos`)
        }
        return {
          fecha: fecha,
          idProducto: idProducto,
          tipoMovimiento: tipoMovimiento,
          descripcion: descripcion,
          cantidad: Number(cantidad),
          usuario: Number(usuario),
          idTienda: Number(idTienda),
        }
      }
    }).then(async (result) => {
      //Mandar usuario a la base de datos si todo correcto
      if(result.isConfirmed){
        let tipoMovimiento = (result.value?.tipoMovimiento === 'E')? 'movimientoentrada':'movimientosalida';
        (await this.requestsService.post(`Movimientos/${tipoMovimiento}`, result.value)).subscribe(
          (data: any) => {
            // Actualizar la lista de usuarios después de agregar uno nuevo
            this.cargarMovimientos();
          },
          (error: any) => {
            console.error('Error al agregar un nuevo usuario:', error);
          }
        )
      }

    })
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
  cerrarSesion(){
    localStorage.clear();
    this.router.navigate([''])
  }

  public csvRecords: any[] = [];

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.csvRecords = XLSX.utils.sheet_to_json(ws, { header: 1 });
      for (let i = 2; i < this.csvRecords.length; i++) {
        if(this.csvRecords[i][2] && this.csvRecords[i][15]){
          let producto:string = this.csvRecords[i][2];
          let nombreproducto = producto.split(' - ')
          const body = {
            idproducto: nombreproducto[1],
            producto: nombreproducto[0],
            total: this.csvRecords[i][15]
          }
          this.arrayBody.push(body);
        }

      }
      console.log(this.arrayBody);

      let table = `<table style="font-size: 12px;">
      <tr>
      <th>Codigo</th>
      <th>Producto</th>
      <th>Cantidad</th>
      </tr>
      ${this.arrayBody.map(e => `<tr>
          <td>${e.idproducto || ''}</td>
          <td>${e.producto || ''}</td>
          <td>${e.total || ''}</td>
      </tr>`).join('')}
      </table>`;
      Swal.fire({
        title: 'Agregar movimiento',
        html: table,
        confirmButtonText: 'Crear Movimiento',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        focusConfirm: false,

    })
    };
    reader.readAsBinaryString(target.files[0]);

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
