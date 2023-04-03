import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  iscollapse: boolean = true
  currentuser: string = ""
  userbalance: number = 0
  currentacno: any = ''
  fundtransfersuccessmsg: any = ''
  fundtransfererrormsg: any = ''
  logoutstatus: boolean = false
  deleteconfirmstatus:boolean=false
  deleteacno:any=''
  deletemsg:string=''
  fundtransferform = this.fb.group({
    creditacno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],

    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]

  })
  constructor(private fb: FormBuilder, private api: ApiService, private dashboardrouter: Router) {

  }
  ngOnInit() {
    // check user is logined or not
    if (!localStorage.getItem('token')) {
      alert('Please login')
      // redirect to login page
      this.dashboardrouter.navigateByUrl('')

    }

    // get currentuser from localstorage
    this.currentuser = localStorage.getItem("currentuser") || ''
    // get currentacno from localstorage
    this.currentacno = JSON.parse(localStorage.getItem("currentacno") || '')
    console.log(typeof (this.currentacno));

  }
  collapse() {
    this.iscollapse = !this.iscollapse
  }
  // getbalance
  getbalance() {
    // api call to get balance
    this.api.getbalance(this.currentacno)
      .subscribe(
        (result: any) => {
          // console.log(result);
          this.userbalance = result.balance
        },
        (result: any) => {
          alert(result.error.message)
        }
      )
  }

  transfer() {
    if (this.fundtransferform.valid) {
      // alert('fund transfer is clicked')
      let toacno = this.fundtransferform.value.creditacno
      let fromacnopswd = this.fundtransferform.value.password
      let amount = this.fundtransferform.value.amount

      // api call
      this.api.fundtransfer(toacno, fromacnopswd, amount)
        .subscribe(
          // 200
          (result: any) => {
            this.fundtransfersuccessmsg = result.message
          },
          //  404 msg
          (result: any) => {
            this.fundtransfererrormsg = result.error.message
          }

        )
      // to reset form after a 2s
      setTimeout(() => {
        this.fundtransferform.reset()
        this.fundtransfersuccessmsg = ''
        this.fundtransfererrormsg = ''

      }, 3000)

    }
    else {
      alert('Invalid form')
    }



  }
  // to reset the fund tranfer form
  resetform() {
    // to reset fund transfer form
    this.fundtransferform.reset()
    // to remove fundtransfersuccessmsg&fundtransfererrormsg
    this.fundtransfersuccessmsg = ''
    this.fundtransfererrormsg = ''
  }

  // logout function
  logout() {
    // remove login details from localstorage
    localStorage.removeItem('token')
    localStorage.removeItem('currentacno')
    localStorage.removeItem('currentuser')
    // set true for logoutstatus
    this.logoutstatus = true
    setTimeout(() => {
      this.dashboardrouter.navigateByUrl('')

    }, 3000)
    // redirect to login page

  }
  // delete my account
  deletemyaccount(){
// set deleteconfirmstatus as true
    this.deleteconfirmstatus=true
    // get acno to be deleted
    this.deleteacno=this.currentacno
    
}


// canceldeleteconfirm()
canceldeleteconfirm(){
  // tohide child deleteconfirm view
  this.deleteacno=""
  // set deleteconfirmstatus=fa;lse
  this.deleteconfirmstatus=false
}


deletefromparent(event:any){
// alert('alert from parent'+ event)
this.deleteacno=""
// make api call to delete acno
this.api.deleteacno()
.subscribe(
  // 200 status
  (result:any)=>{
// display delete msg
  this.deletemsg=result.message
  // remove login details from local storage
  localStorage.removeItem('token')
  localStorage.removeItem('currentacno')
  localStorage.removeItem('currentuser')
setTimeout(()=>{
  this.dashboardrouter.navigateByUrl('')
},3000)
},
// 401 status
(result:any)=>{
  this.deletemsg=result.error.message
}


)

}
}
