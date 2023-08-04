import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, connect,of } from 'rxjs';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import { TYPE } from './pagina-principal/values.constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  url: string = "https://localhost:7292/api/"
  constructor(private http:HttpClient, private Router:Router) { }

  async login(body:any,endpoint:string){

    return await this.http.post<any>(`${this.url}${endpoint}`,body)
  }


  async get(endpoint:string){
    return await this.http.get<any>(`${this.url}${endpoint}`,{headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getJWT()}`
    })})
  }
  async post(endpoint:string,data:any){
    console.log("Funciona");
    return await this.http.post<any>(`${this.url}${endpoint}`,data,{headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getJWT()}`
    })})
  }
  async put(endpoint:string,data:any){
    console.log(data)
    return await this.http.put<any>(`${this.url}${endpoint}`,data,{headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getJWT()}`
    })})
  }
  async delete(endpoint:string){
    console.log(`${this.url}${endpoint}`)
    return await this.http.delete<any>(`${this.url}${endpoint}`,{headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getJWT()}`
    })})
  }
  async patch(endpoint:string,data:any){
    console.log(data)
    return await this.http.patch<any>(`${this.url}${endpoint}`,data,{headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getJWT()}`
    })})
  }

  sessionExpiredSwal(){
    Swal.fire({
      toast: true,
    position: 'top',
    showConfirmButton: false,
    icon: TYPE.ERROR,
    timerProgressBar:false,
    timer: 5000,
    title: 'Sesion expirada, porfavor inicie sesion'

    })
  }

  checkSession(){

    let decodedToken;
    try {
      let token = this.getJWT();
      decodedToken = jwt_decode(token) as { [key: string]: any };
    } catch (error) {
      console.log('Error decodificando el token', error);
      this.sessionExpiredSwal();
      this.Router.navigate(['/'])
      return;
    }

    let dateNow = new Date();
    let dateNowUnix = Math.floor(dateNow.getTime() / 1000);
    if(decodedToken['exp'] < dateNowUnix){
      this.sessionExpiredSwal();
      this.Router.navigate(['/'])
    }
  }

  getSessionInfo(){
    const datax : any = localStorage.getItem('response');
    const data = JSON.parse(datax);
    return data;
  }

  getJWT(){
    const datax : any = localStorage.getItem('response');
    const data = JSON.parse(datax);
    return data.jwtToken;
  }


}
