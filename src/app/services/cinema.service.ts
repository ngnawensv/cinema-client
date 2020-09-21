import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public  host:string="http://localhost:8080"
  constructor(private httpClient:HttpClient) { }

  public getVilles(){
    return this.httpClient.get(this.host+"/villes");

  }

  public getCinemas(v){
    return this.httpClient.get(v._links.cinemas.href); //ou return this.httpClient.get(host+"/cinemas");
  }

  getSalles(c) {
    return this.httpClient.get(c._links.salles.href);
  }

  getProjections(salle) {
    let url=salle._links.projections.href.replace("{?projection}","");
    return this.httpClient.get(url+"?projection=p1");
  }

  onGetTicketsPlaces(p) {
    let url=p._links.tickets.href.replace("{?projection}","");
    return this.httpClient.get(url+"?projection=ticketProj");
  }

  payerTicket(dataForm) {
    return this.httpClient.post(this.host+"/payerTickets",dataForm);

  }
}
