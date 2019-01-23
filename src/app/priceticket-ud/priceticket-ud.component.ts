import { Component, OnInit, Inject} from '@angular/core';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as cloneDeep from 'lodash/cloneDeep';
import { PriceticketDTOFrontend } from '../model/priceticket-dtoFrontend';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';


export interface DialogData {
  priceline: number;
  pricezone: number;
  dateFrom: string;
}

@Component({
  selector: 'app-priceticket-ud',
  templateUrl: './priceticket-ud.component.html',
  styleUrls: ['./priceticket-ud.component.css']
})
export class PriceticketUdComponent implements OnInit {

  private idx: number;
  private pricelineEdit: number;
  private pricezoneEdit: number;
  private datefromEdit: any;

  private priceticketsDTO: PriceticketDTOFrontend[];
  private editItem: any;
  private readonly priceTicketsFrontendDTOsUrl: string = '/priceticket/pricetickets';
  public errorMessage: string;


  constructor(private service: GenericService, private toastr: ToastrService, 
              public dialog: MatDialog, private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.editItem = {id: 0, dateFrom: '', passengerType: '', ticketType: '', priceLine: 0, priceZone: 0, id_zone: 0};
    this.priceticketsDTO = [];
    this.errorMessage = '';
    this.getPriceTickets();
   }

   getPriceTickets() {
    return this.service.get(this.priceTicketsFrontendDTOsUrl).subscribe(
      (list: PriceticketDTOFrontend[]) => {
        this.priceticketsDTO = list;
      }
    );
  }


   editPriceticket(data) {
      this.editItem = cloneDeep(this.priceticketsDTO[data.idx]);

      const id: number = this.priceticketsDTO[data.idx]['id'];



      let characters = String(data.datefrom).split('.');

      this.editItem.priceLine = data.priceline;
      this.editItem.priceZone = data.pricezone;

      this.editItem.dateFrom = characters[2]  + '-' + characters[1] + '-' + characters[0]; 

      this.editItem.passengerType = this.editItem.passengerType.toUpperCase();
      this.editItem.ticketType = this.editItem.ticketType.toUpperCase();

    return this.service.put( '/priceticket/' + id + '/update', this.editItem).subscribe(
      (res: any) => {
          if (res['changed'] === 'true') {
            this.toastr.success(res['message']);
            this.priceticketsDTO[data.idx]['priceLine'] = this.editItem.priceLine;
            this.priceticketsDTO[data.idx]['priceZone'] = this.editItem.priceZone;

            characters = String(this.editItem.dateFrom).split('-');

            this.priceticketsDTO[data.idx]['dateFrom'] = characters[2] + '.' + characters[1] + '.' + characters[0];
          } else {
            this.errorMessage = res['message'];
            this.toastr.error(res['message']);
            
          }          
      }, (err: any) => this.toastr.error('Adding a priceticket failed !!!')
    );

    
    
  }
  ngOnInit() {
  }



  onEdit(index): void {

    this.idx = index;
    this.pricelineEdit = this.priceticketsDTO[index]['priceLine'];
    this.pricezoneEdit = this.priceticketsDTO[index]['priceZone'];
    this.datefromEdit =  this.priceticketsDTO[index]['dateFrom'];

    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '270px',
      data: {idx: this.idx, priceline: this.pricelineEdit, pricezone: this.pricezoneEdit,
        datefrom: this.datefromEdit}
    });




    dialogRef.afterClosed().subscribe(result => {

      if (String(result) === 'Cancel') {
        console.log('The dialog was closed');
      } else {
        this.editPriceticket(result);
      } 
    });
  }


  onDelete(index) {
    const id = this.priceticketsDTO[index]['id']; 
    this.priceticketsDTO.splice(index, 1);

    return this.service.delete('/priceticket', id).subscribe(
      (res: any) => {
        if (res['deleted'] === 'true') {
          this.toastr.success(res['message']);
        } else {
          this.toastr.error(res['message']);
        }
      });
  }

}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './editDialog.html',
})
export class EditDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private toastr: ToastrService, private ngbDateParserFormatter: NgbDateParserFormatter) {}
  onCancelClick(): void {
    this.dialogRef.close('Cancel');
  }

  onSave() {

    if (this.ngbDateParserFormatter.parse(this.data['datefrom']) == null) {
      this.toastr.error('Date format is not correct!!!');
      return;
    }


    this.dialogRef.close(this.data);
  }

}

