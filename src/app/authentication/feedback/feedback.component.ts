import { Component, OnInit } from '@angular/core';
import { ReceiptService } from 'src/app/share/services/receipt.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  constructor(
    private receipt_service : ReceiptService
  ) { }

  ngOnInit(): void {
    this.receipt_service.loadFeedback().then(result=>{
      this.item = result;
    })
  }

  item:any;

}
