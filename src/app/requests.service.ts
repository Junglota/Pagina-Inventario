import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { connect } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  url: string = "https://contabilidadsinrebu.azurewebsites.net/api/"
  constructor(private http:HttpClient) { }

  async login(body:any,endpoint:string){

    return await this.http.post<any>(`${this.url}${endpoint}`,body)
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
}
