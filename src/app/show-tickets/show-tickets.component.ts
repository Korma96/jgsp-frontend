import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../model/ticket';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { DownloadFileService } from '../services/download-file/download-file.service';

@Component({
  selector: 'app-show-tickets',
  templateUrl: './show-tickets.component.html',
  styleUrls: ['./show-tickets.component.css']
})
export class ShowTicketsComponent implements OnInit {

  @Input()
  tickets: Ticket[];


  constructor(private downloadFileService: DownloadFileService, private toastr: ToastrService) { 
      this.tickets = [];
  }

  ngOnInit() {
  }

  download(id: number) {
      this.downloadFileService.getPdfFile(id);

  }



}
