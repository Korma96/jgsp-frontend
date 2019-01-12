import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  
  relativeUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) {
      this.relativeUrl = '/passengers/print-ticket';
  }

  getPdfFile(id: number) {
    const httpOptions = {
      'responseType': 'arraybuffer' as 'json'
     };

    return this.http.get(this.baseUrl + this.relativeUrl + '/' + id, httpOptions)
          .subscribe( (pdf: any) => {
              console.log('pdf response: ', pdf);    
              const mediaType = 'application/pdf';
              const blob = new Blob([pdf], {type: mediaType});
              
              this.saveAs(blob, `ticket_${id}`);
            }, 
            err => console.log('Pdf generated err: ', JSON.stringify(err))
          );
   
  }

  saveAs(blob, fileName) {
    console.log('start download:', fileName);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.innerText = fileName;
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    //window.open(url);
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
   }


   getImageFile(relativeUrl: string, id: number) {
    const httpOptions = {
      'responseType': 'arraybuffer' as 'json'
     };
  
    return this.http.get<any>(this.baseUrl + relativeUrl + `/${id}`, httpOptions);
  }

}
