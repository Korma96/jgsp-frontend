import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic/generic.service';
import { Observable } from 'rxjs';
import { HttpClient } from 'selenium-webdriver/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-check-ticket-page',
  templateUrl: './check-ticket-page.component.html',
  styleUrls: ['./check-ticket-page.component.css']
})
export class CheckTicketPageComponent implements OnInit {

  private readonly getAllUrl: string = '/line/all';
  private data: string[];
  private map: Object;
  public passenger;

  private idLine: number;

  constructor(private service: GenericService, private toastr: ToastrService) { 
    this.data = [];
    this.idLine = 0;
    this.map = {};
    this.passenger = {};
    this.getAll()
    .subscribe( res => {
      for (let i = 0; i < res.length; i++) {
        this.data.push(res[i]);
        this.map[res[i]['name']] = res[i]['id'];
      }
    });
  }

  ngOnInit() {
  }

  getAll(): Observable<any>  {
    
    return this.service.get(this.getAllUrl).
    map((res: any) => {

      return res;
    });
  }


  onSelect(name) { 
    this.idLine = this.map[name];
  }

  checkTicket() {

   return  this.service.put('/checkticket/:' + this.passenger.username + '/zoneLine/:' + this.idLine, {}).
   subscribe((valid: boolean) => {
      if (valid) {
        this.toastr.success('There is at least one valid ticket :)');
      } else {
        this.toastr.error('There is no valid ticket!!!');
      }
   });
  }
}
