import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-transport-admin-page',
  templateUrl: './transport-admin-page.component.html',
  styleUrls: ['./transport-admin-page.component.css']
})
export class TransportAdminPageComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.router.url === '/transport') {
      this.router.navigate(['/transport/zone'], { relativeTo: this.route });
    }
  }

}
