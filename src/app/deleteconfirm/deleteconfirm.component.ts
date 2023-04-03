import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-deleteconfirm',
  templateUrl: './deleteconfirm.component.html',
  styleUrls: ['./deleteconfirm.component.css']
})
export class DeleteconfirmComponent {
  // since it is obtained from parent ,we write it inside the decorator
  @Input() acno: any
  @Output() oncancel = new EventEmitter
  @Output() ondelete = new EventEmitter

  cancel() {
    // to occur an userdefined event use emit()
    this.oncancel.emit()
  }


  deletefromchild() {
    // generate a userdefined event
    // we need to tell which account details is to be deleted,so we need to specify it as argument in step 23
    this.ondelete.emit(this.acno)

  }
}
