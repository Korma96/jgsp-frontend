import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit {

  @Input()
  image: any;

  @Input()
  imageLoaded: boolean;


  constructor() { }

  ngOnInit() {
  }

}
