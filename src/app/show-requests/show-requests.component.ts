import { Component, OnInit, Input, Output } from '@angular/core';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { Request } from '../model/request';
import { DownloadFileService } from '../services/download-file/download-file.service';

@Component({
  selector: 'app-show-requests',
  templateUrl: './show-requests.component.html',
  styleUrls: ['./show-requests.component.css']
})
export class ShowRequestsComponent implements OnInit {

  requests: Request[];
  relativeUrlForRequests: string;

  imageForShow: any;
  imageForShowLoaded: boolean;

  relativeUrlForImage: string;

  relativeUrlForAcceptOrDecline: string;

  constructor(private genericService: GenericService, private toastr: ToastrService,
              private downloadFileService: DownloadFileService) {
    this.relativeUrlForRequests = '/userAdmin/get-requests';
    this.relativeUrlForImage = '/userAdmin/get-image';
    this.relativeUrlForAcceptOrDecline = '/userAdmin/request-review';
    
    this.imageForShow = null;
    this.imageForShowLoaded = false;
  }

 
  ngOnInit() {
    this.getRequests();
  }


  acceptOrDecline(accepted: boolean, request: Request) {
      this.genericService.put<boolean>(this.relativeUrlForAcceptOrDecline + '/' + request.id, accepted).subscribe(
        (res: boolean) => {
          if (res) {
            const index = this.requests.indexOf(request); 
            if (index !== -1) {
              this.requests.splice(index, 1);
          
            }        
            this.toastr.success('Successfully reviewed request!');
          }
          else {
            this.toastr.error('Review was not successful');
          }
        },
        () => this.toastr.error('Review was not successful')
      );
  }

  getRequests() {
    this.genericService.getAll<Request>(this.relativeUrlForRequests).subscribe(
      (requests: Request[]) => {
          this.requests = requests;
          if (this.requests) {
            if (this.requests.length > 0) {
              this.requests.forEach( r => this.getImage(r.id, r.idConfirmation));
      
              this.toastr.success('Requests are successfully loaded!');
            }
            else {
              this.toastr.warning('There are no requests at the moment!');
            }
          }
          else {
            this.toastr.error('Problem with loading of requests!');
          }
      },
      error => console.log('Error: ' + JSON.stringify(error))
    );

  }

  getImage(idPassenger: number, idImage: number) {
    this.downloadFileService.getImageFile(this.relativeUrlForImage, idImage).subscribe(
      (bytes: any) => {
      const mediaType = 'image/jpeg';
      const blob = new Blob([bytes], {type: mediaType});
      this.createImageFromBlob(idPassenger, blob);
      this.setImageLoaded(idPassenger, true);
      },
      err => this.setImageLoaded(idPassenger, false)
    );
  }

  setImageLoaded(idPassenger: number, imageLoaded: boolean) {
    for (const req of this.requests) {
      if (req.id === idPassenger) {
        req.imageLoaded = imageLoaded;
        return;
      }
    }
  }

  setImage(idPassenger: number, image: any) {
    for (const req of this.requests) {
      if (req.id === idPassenger) {
        req.image = image;
        return;
      }
    }
  }

  setImageForShow(idPassenger: number) {
    for (const req of this.requests) {
      if (req.id === idPassenger) {
        this.imageForShow = req.image;
        this.imageForShowLoaded = req.imageLoaded;
        return;
      }
    }
  }

  createImageFromBlob(idPassenger: number, blob: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setImage(idPassenger, reader.result);
    }, false);
  
    if (blob) {
      reader.readAsDataURL(blob);
    }
  }

}
