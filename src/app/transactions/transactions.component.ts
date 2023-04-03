import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
// try to import in the same name of library
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit{
  alltransactions:any=[]
searchterm:string=''
  constructor(private api:ApiService,private transactionRouter:Router){
  }
  ngOnInit(): void {

        // check user is logined or not
        if (!localStorage.getItem('token')) {
          alert('Please login')
          // redirect to login page
          this.transactionRouter.navigateByUrl('')
    
        }
    
    
    // call ministatement api
    this.api.ministatement().subscribe((result:any)=>{
      console.log(result.transactions);
      this.alltransactions=result.transactions
    })

  }
  
  filter(event:any){
    this.searchterm=event.target.value
  }
  // to download documents using jspdf
  generatepdf(){
// create an object for jspdf
var pdf =new jspdf()
// set up columns for table
let col=['Transaction Type','From Account','To Account','Amount']
// set up row for table
let row:any=[]
// basic styling for pdf documnet
// heading-style for heading
pdf.setFontSize(16)
pdf.text('MINI STATEMENT',15,10)
pdf.setFontSize(12)
pdf.setTextColor(99)


// convert alltransaction to nested array
var allitems=this.alltransactions
for(let item of allitems){
  // item is object,i need to covert it into array
  var temp=[item.type,item.fromacno,item.toacno,item.amount]
  row.push(temp)
}
// convert nested array to pdf
(pdf as any).autoTable(col,row,{startY:15})
// open table in another tab in browser
pdf.output('dataurlnewwindow')
// download table as pdf
pdf.save('ministatements.pdf')

  }
}
