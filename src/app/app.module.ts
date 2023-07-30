import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaPrincipalComponent } from './pagina-principal/pagina-principal.component';
import { DashComponent } from './dash/dash.component';
import { DashUserComponent } from './dash-user/dash-user.component';
import { DashProductComponent } from './dash-product/dash-product.component';
import { IndexStockComponent } from './index-stock/index-stock.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { DashMovimientosComponent } from './dash-movimientos/dash-movimientos.component';
import { DashUserProductComponent } from './dash-user-product/dash-user-product.component';
import { IndexCategoriaComponent } from './index-categoria/index-categoria.component';


const appRoutes: Routes = [
  {path: '',component:PaginaPrincipalComponent},
  {path: 'dash',component:DashComponent},
  {path: 'usuarios',component:DashUserComponent},
  {path: 'productos',component:DashProductComponent},
  {path: 'stock',component:IndexStockComponent},
  {path: 'recuperacion',component:RecuperacionComponent},
  {path: 'movimientos',component:DashMovimientosComponent},
  {path: 'usuarioproducto',component:DashUserProductComponent},
  {path: 'categoria',component:IndexCategoriaComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    PaginaPrincipalComponent,
    DashComponent,
    DashUserComponent,
    DashProductComponent,
    IndexStockComponent,
    RecuperacionComponent,
    //DashMovimientosComponent,
    DashUserProductComponent,
    IndexCategoriaComponent,
    DashMovimientosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
