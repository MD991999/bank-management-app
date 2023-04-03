import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const options={
  headers:new HttpHeaders()
}



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) {

   }
  //  register api call

  register(acno:any,uname:any,pswd:any){
    const body={
      acno,
      uname,
      pswd
    }
    // server register api -post

   return  this.http.post('http://localhost:3000/register',body)
  }
  // login api call
  login(acno:any,pswd:any){
    const body={
      acno,
      pswd
    }
    // server call-http://localhost:3000/login
    return this.http.post('http://localhost:3000/login',body)
  }

// add token to request to headers
appendtoken(){
  // to get token from localstorage
  const token=localStorage.getItem('token')
  // create request headers
  let headers=new HttpHeaders()
  if(token){
    // append token in verify token as key in header
    headers=headers.append('verify-token',token)
    options.headers=headers
  }
  return options
}











  // getbalance
  getbalance(acno:any){
    // server call to get balance for requested acno
    return this.http.get('http://localhost:3000/getbalance/'+acno,this.appendtoken())
  }

  // fund transfer
  // use the same variable that you use in the thunderclient
  fundtransfer(toacno:any,pswd:any,amount:any){
    const body={
      toacno,
      pswd,
      amount
    }
    // api call
    return this.http.post('http://localhost:3000/fund-transfer',body,this.appendtoken())
  }
  // transaction history
ministatement(){
  // api for transaction history
return  this.http.get('http://localhost:3000/transactions',this.appendtoken())
}

// delete acount api
deleteacno(){
 return  this.http.delete('http://localhost:3000/delete-acno',this.appendtoken())
}
}
