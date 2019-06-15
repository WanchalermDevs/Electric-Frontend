import { Component, OnInit } from '@angular/core';
import { PeriodService } from '../../services/period.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectricalMeterService } from '../../services/electrical-meter.service';

declare const $: any;

@Component({
  selector: 'app-peroid-dashboard',
  templateUrl: './peroid-dashboard.component.html',
  styleUrls: ['./peroid-dashboard.component.css']
})
export class PeroidDashboardComponent implements OnInit {

  periodInfo: any = { code: '', name: '', agent: { agent_k: false, agent_c: false } };
  periodID: any;

  electricalMeterList: any = [];

  oldElectricMeterList: any = [];

  columns = [
    { title: 'รหัสมิเตอร์' },
    { title: 'ชื่อมิเตอร์', width: '30%' },
    { title: 'หน่วยเก่า' },
    { title: 'หน่วยใหม่' },
    { title: 'หน่วยที่ใช้' },
    { title: 'ค่าไฟฟ้า', className: 'text-right' },
    { title: 'ค่ามิเตอร์', className: 'text-right' },
    { title: 'รวมเป็นเงิน', className: 'text-right' }
  ];

  constructor(
    private periodService: PeriodService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private electricalMeterService: ElectricalMeterService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      this.periodID = atob(param['id']);
      this.periodService.getAPeroidPay(this.periodID).then(periodResponse => {
        this.periodInfo = periodResponse['list'][0];
        this.periodInfo['agent'] = JSON.parse(this.periodInfo['agent']);
        this.periodInfo['unit_price'] = parseInt(this.periodInfo['unit_price'], 10).toFixed(2);
        this.periodService.getElectricUsedList(this.periodID).then(responseUsed => {
          console.log(responseUsed);
        });
      });
    });

    $('#electricalMeterTable').DataTable({
      destroy: true,
      columns: this.columns,
      data: []
    });
    this.setTable();
  }

  setTable() {
    this.electricalMeterList = [];
    this.periodService.getElectricUsedList(this.periodID).then(async (peroidResponse: any[]) => {
      await this.setOleUnit();
      peroidResponse['list'].forEach(async (rows, index) => {
        try {
          const offset = (rows['offset'] == null) ? 0 : rows['offset'];
          const oldUnit = await this.getOldValue(rows['id']);
          const newUnit = (rows['used'] == null) ? 0 : rows['used'];
          const calUnit = newUnit - oldUnit;
          const electricPrice = this.periodInfo['unit_price'] * calUnit;
          const meterPrice = 5;
          const totalPrice = electricPrice + meterPrice;

          // tslint:disable-next-line:max-line-length
          const tempData = [rows['code'], rows['text'], oldUnit, newUnit, calUnit, electricPrice.toFixed(2), meterPrice.toFixed(2), totalPrice.toFixed(2)];
          this.electricalMeterList.push(tempData);
          $('#electricalMeterTable').DataTable({
            destroy: true,
            columns: this.columns,
            data: this.electricalMeterList,
            order: [[0, 'asc']],
          });
        } catch (error) {
        }
      });
    });
  }

  gotoCreateBillPayment() {
    this.router.navigateByUrl('/ออกใบแจ้งชำระเงิน/' + btoa(this.periodID));
  }

  async getOldValue(meterID) {
    let temp = 0;
    if (this.periodInfo['previous_period'] === -1) {

    } else {
      await this.oldElectricMeterList.forEach(element => {
        if (element['id'] === meterID) {
          console.log('used: ', element['used']);
          temp = element['used'];
          return temp;
        } else {
          console.log('temp false', temp);
        }
      });
    }
    return temp;
  }

  async setOleUnit() {
    if (this.periodInfo['previous_period'] === -1) {

    } else {
      await this.periodService.getElectricUsedList(this.periodInfo['previous_period']).then(responseOldList => {
        this.oldElectricMeterList = responseOldList['list'];
      });
    }
  }

  gotoForm() {
    this.router.navigateByUrl('/แบบฟอร์มบันทึกการใช้ไฟฟ้า/' + btoa(this.periodID));
  }

}
