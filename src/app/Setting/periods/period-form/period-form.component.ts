import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodService } from '../../../services/period.service';
import * as moment from 'moment';

@Component({
  selector: 'app-period-form',
  templateUrl: './period-form.component.html',
  styleUrls: ['./period-form.component.css']
})
export class PeriodFormComponent implements OnInit {

  @ViewChild('peroidForm') periodForm: NgForm;
  operate: any;

  periodList: any = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private periodPayService: PeriodService) { }

  ngOnInit() {

    this.periodPayService.getAllPeriodPay().then(list => {
      this.periodList = list['list'];
      console.log(this.periodList);
    });

    this.operate = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.operate != null) {
      // this.periodPayService
      this.periodPayService.getAPeroidPay(this.operate).then(response => {
        if (response['operation'] === 'success') {
          const agent = JSON.parse(response['list'][0]['agent']);
          this.periodForm.control.setValue({
            code: response['list'][0]['code'],
            name: response['list'][0]['name'],
            edu_year: response['list'][0]['edu_year'],
            edu_semester: response['list'][0]['edu_semester'],
            date_start_pay: response['list'][0]['date_start_pay'],
            date_last_pay: response['list'][0]['date_last_pay'],
            date_start_download: response['list'][0]['date_start_download'],
            date_last_download: response['list'][0]['date_last_download'],
            unit_price: response['list'][0]['unit_price'],
            agent_k: agent['agent_k'],
            agent_c: agent['agent_c'],
            operated_person: response['list'][0]['operated_person'],
            previous_period: response['list'][0]['previous_period']
          });
        }
      });
    } else {
      setTimeout(() => {
        this.periodForm.control.setValue({
          code: '',
          name: '',
          edu_year: '',
          edu_semester: '',
          date_start_pay: '',
          date_last_pay: '',
          date_start_download: '',
          date_last_download: '',
          unit_price: 5,
          agent_k: false,
          agent_c: false,
          operated_person: window.localStorage.getItem('thai_name'),
          previous_period: '-1'
        });
      }, 100);
    }
  }

  formSubmit(form: NgForm) {
    const agent = {
      agent_k: form['agent_k'],
      agent_c: form['agent_c']
    };
    if (this.operate != null) {
      // tslint:disable-next-line:max-line-length
      this.periodPayService.editPeriodPay(form['code'], form['name'], form['edu_year'], form['edu_semester'], form['date_start_pay'], form['date_last_pay'], form['date_start_download'], form['date_last_download'], JSON.stringify(agent), form['operated_person'], form['unit_price'], this.operate, form['previous_period']).then(response => {
        if (response['operation'] === 'success') {
          this.router.navigateByUrl('/การตั้งค่า/รอบบัญชี');
        }
      });
    } else {
      // tslint:disable-next-line:max-line-length
      this.periodPayService.createNewPeroidPayment(form['code'], form['name'], form['edu_year'], form['edu_semester'], form['date_start_pay'], form['date_last_pay'], form['date_start_download'], form['date_last_download'], JSON.stringify(agent), form['operated_person'], form['unit_price'], form['previous_period']).then(response => {
        if (response['operation'] === 'success') {
          this.router.navigateByUrl('/การตั้งค่า/รอบบัญชี');
        }
      });
    }

  }

}
 