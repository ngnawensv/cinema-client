import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public currentVille;
  public currentCinema;
  private salles;
  private currentProjection;
  private selectedTickets;
  constructor(public cinemaService:CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles().subscribe(
      data=>{
        this.villes=data;
      },
      error => {
        console.log(error);
      }
    )
  }

  onGetCinemas(v){
    this.currentVille=v;
    this.salles=undefined; //Vide les données de la salle après selection d'un cinéma
    this.cinemaService.getCinemas(v).subscribe(
      data=>{
        this.cinemas=data;
      },
      error => {
        console.log(error);
      }
    )
  }

  onGetSalles(c){
    this.currentCinema=c;
    this.cinemaService.getSalles(c).subscribe(
      data=>{
        this.salles=data;
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjections(salle).subscribe(
            data=>{
             salle.projections=data;
            },
            error => {
              console.log(error);
            }
          )
        })
      },
      error => {
        console.log(error);
      }
    )

  }

  onGetTicketsPlaces(p) {
    this.currentProjection=p;
    this.cinemaService.onGetTicketsPlaces(p).subscribe(
      data=>{
        this.currentProjection.tickets=data;
        this.selectedTickets=[];
      },
      error => {
        console.log(error);
      });

  }

  onSelectTicket(t) {
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }else{
      t.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t) {
    let str="btn ";
    if(t.reserve==true){
      str+="btn-danger ticket";
    }else if (t.selected){
      str+="btn-warning ticket";
    } else{
      str+="btn-success ticket";
    }
    return str;
  }

  onPayTickets(dataForm) {
    let tickets=[];
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id)
    });
    dataForm.tickets=tickets;
    console.log(dataForm);
    this.cinemaService.payerTicket(dataForm).subscribe(
      data=>{
        alert("Ticket réservés avec succès!")
        this.onGetTicketsPlaces(this.currentProjection);
      },
      error => {
       console.log(error);
      });
  }
}
