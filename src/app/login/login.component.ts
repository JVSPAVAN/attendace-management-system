import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpDataService } from '../services/http-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  userData = {
    email: 'helloworld',
    password: '12345',
  };
  url = '';

  constructor(
    private fb: FormBuilder,
    private httpDataSerice: HttpDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    sessionStorage.setItem('login', 'false');
    sessionStorage.setItem('isAdmin', 'false');
    this.httpDataSerice.setLoginReset('false');
    this.formInitializer();
  }
  formInitializer() {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  login() {
    let userEmail = this.loginForm.controls['email'].value;
    let userPass = this.loginForm.controls['password'].value;
    let userData = { email: userEmail, password: userPass };
    this.httpDataSerice.login().subscribe((data: any) => {
      if (data) {

        data.forEach((element: any) => {
          if((element.user === userEmail) && (element.password === userPass)){
            sessionStorage.setItem('login', 'true');
            this.httpDataSerice.setLoginReset('true');
            if(userEmail === 'admin'){
              sessionStorage.setItem('isAdmin', 'true');
            }else{
              sessionStorage.setItem('isAdmin', 'false');
            }
            sessionStorage.setItem('user', userEmail);
            this.router.navigate(['/' + 'home']);
          }
        });
      }
    });
  }
}
