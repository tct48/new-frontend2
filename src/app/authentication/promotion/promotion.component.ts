import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/share/shareds/alert.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {

  constructor(
    private alert:AlertService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.alert.success();
  }

  onSubmit2(){
    this.alert.success();
  }

  onSubmit3(){
    this.alert.success();
  }
}
