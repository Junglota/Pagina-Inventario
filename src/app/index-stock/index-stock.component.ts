import { Component,OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { RequestsService } from '../requests.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  sessionData = this.requestsService.getSessionInfo();
  endpoint:string = this.sessionData.userType == 1? 'Inventarios': `Inventarios/tienda/${this.sessionData.idTienda}`;
  inputTienda:boolean = this.sessionData.userType == 1? true:false;


  constructor(private requestsService:RequestsService, private router:Router){}

  ngOnInit(){
    this.requestsService.checkSession();
    this.cargarStock()
  }

  async cargarStock(){
    console.log(this.endpoint);
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

  editarStock(stock:any){
    console.log(stock);

    Swal.fire({
      title: 'Editar inventario',
      html: `
    <div class="form-group">
      <label for="stock">Stock:</label>
      <input type="text" id="stock" name="stock" value=${ stock.stock} required>
    </div>
    <div class="form-group">
      <label for="stockMinimo">Stock Minimo:</label>
      <input type="text" id="stockMinimo" name="stockMinimo" value=${ stock.stockMinimo} required>
    </div>`,
      confirmButtonText: 'Modificar Producto',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        //const nombre = Swal.getPopup()?.querySelector<any>('#nombre').value;
        const intId = stock.intId;
        const idProducto = stock.codigoProducto;
        const cantidad = Swal.getPopup()?.querySelector<any>('#stock').value;
        const stockMinimo = Swal.getPopup()?.querySelector<any>('#stockMinimo').value;
        const idTienda = stock.idTienda;
        if (/*!nombre ||*/ !idProducto|| !cantidad|| !stockMinimo || !idTienda) {
          console.log(idProducto,cantidad,stockMinimo,idTienda);

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

  buscarProducto(busqueda: string): void {
    console.log(busqueda)
    let resultados:any
    resultados = this.productos.filter((val) =>
      val && val.nombreProducto && val.nombreProducto.toLowerCase().includes(busqueda)
    );
    this.pageSlice = resultados.slice(0,10)
    console.log(resultados)
    console.log(this.pageSlice)
  }


  cerrarSesion(){
    localStorage.clear();
    this.router.navigate([''])
  }

  async imprimirPedidoMinimo() {
    const productosBajoStockMinimo = this.productos.filter(producto => producto.stock < producto.stockMinimo);

    if (productosBajoStockMinimo.length > 0) {
      const pedidoMinimoTexto = productosBajoStockMinimo.map(producto => `${producto.intId} - ${producto.stock}`).join('\n');

      const docDefinition = {
        content: [
          { text: 'Pedido de productos con stock bajo el mínimo', style: 'header' },
          { text: pedidoMinimoTexto, style: 'body' }
        ],
        styles: {
          header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
          body: { fontSize: 12, margin: [0, 0, 0, 10] }
        }
      };

      pdfMake.createPdf(docDefinition).download('pedido_minimo.pdf');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No hay productos con stock bajo el mínimo',
      });
    }
  }

  async exportarStockProducto() {
    const csvContent = this.convertToCSV(this.productos);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'stock_producto.csv');
  }

  private convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(item => Object.values(item).join(','));

    return header + rows.join('\n');
  }
}
