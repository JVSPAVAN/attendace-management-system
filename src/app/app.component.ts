import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpDataService } from './services/http-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'student-management-system';
  url: any;
  show: any;

  constructor(
    private router: Router,
    private httpDataSerice: HttpDataService,
  ) {}

  ngOnInit() {
    this.url = this.router.url;
    if (sessionStorage.getItem('login') == 'true') {
      this.show = true;
    } else {
      this.show = false;
    }
    //console.log("url ",this.url);
    this.httpDataSerice.getLoginReset().subscribe((status: any) => {
      if (status) {
        if (sessionStorage.getItem('login') == 'true') {
          this.show = true;
        } else {
          this.show = false;
        }
      }});
    }

  moduleChange(link: any) {
    this.url = link;
    console.log('url ', this.url);
    if(link == 'login'){
      this.httpDataSerice.setLoginReset('false');
    }
    this.router.navigate(['./' + link]);
  }
}
