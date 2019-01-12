import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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


  acceptOrDecline(id: number, accepted: boolean) {
      this.genericService.put<boolean>(this.relativeUrlForAcceptOrDecline + '/' + id, accepted).subscribe(
        (res: boolean) => {
          if (res) {
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
              this.requests.forEach( r => this.getImage(r.id));
      
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

  getImage(id: number) {
    this.downloadFileService.getImageFile(this.relativeUrlForImage, id).subscribe(
      (bytes: any) => {
      const mediaType = 'image/jpeg';
      const blob = new Blob([bytes], {type: mediaType});
      this.createImageFromBlob(id, blob);
      this.setImageLoaded(id, true);
      },
      err => this.setImageLoaded(id, false)
    );
  }

  setImageLoaded(id: number, imageLoaded: boolean) {
    for (const req of this.requests) {
      if (req.id === id) {
        req.imageLoaded = imageLoaded;
        return;
      }
    }
  }

  setImage(id: number, image: any) {
    for (const req of this.requests) {
      if (req.id === id) {
        req.image = image;
        return;
      }
    }
  }

  setImageForShow(id: number) {
    for (const req of this.requests) {
      if (req.id === id) {
        this.imageForShow = req.image;
        this.imageForShowLoaded = req.imageLoaded;
        return;
      }
    }
  }

  createImageFromBlob(id: number, blob: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setImage(id, reader.result);
    }, false);
  
    if (blob) {
      reader.readAsDataURL(blob);
    }
  }

}
