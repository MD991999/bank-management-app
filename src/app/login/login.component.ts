import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // successmessage
  successmsg: boolean = false
  // errormessage
  errormsg: string = ''


  loginform = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],

  })
  constructor(private fb: FormBuilder, private api: ApiService, private loginrouter: Router) {

  }
  login() {
    if (this.loginform.valid) {
      let acno = this.loginform.value.acno
      let password = this.loginform.value.password
      // api call to login
      this.api.login(acno, password)
        .subscribe(
          (result: any) => {
            // login success
            this.successmsg = true

            // get username from result and store it in localstorage
            localStorage.setItem("currentuser", result.currentusername)
            // we are gonna store the account number in the localstorage
            localStorage.setItem("currentacno", result.currentacno)
// get token from reult and store it in localstorage
localStorage.setItem('token',result.token)
            // code to redirect aafter 3sec
            setTimeout(() => {
              this.loginrouter.navigateByUrl('dashboard')
            }, 3000);
            // alert(result.message)

          },
          (result: any) => {
            this.errormsg = result.error.message
            // alert(result.error.message);
            // after 3sec refresh login form and errormsg
            setTimeout(() => {
              this.loginform.reset()
              this.errormsg = ''
            }, 3000)

          }
        )
    }
    else {
      alert('Invalid form')
    }
  }
}
