import { Component, OnInit } from '@angular/core';
import { PeriodService } from '../../services/period.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectricalMeterService } from '../../services/electrical-meter.service';

declare const $: any;

@Component({
  selector: 'app-electricity-used-form',
  templateUrl: './electricity-used-form.component.html',
  styleUrls: ['./electricity-used-form.component.css']
})
export class ElectricityUsedFormComponent implements OnInit {

  periodInfo: any = { code: '', name: '', agent: { agent_k: false, agent_c: false } };
  electricalMeterList: any = [];
  periodID: any;
  oldElectricMeterList: any = [];

  columns = [
    { title: 'รหัสมิเตอร์' },
    { title: 'ชื่อมิเตอร์', width: '30%' },
    { title: 'หน่วยเก่า' },
    { title: 'ปรับปรุงหน่วยเก่า' },
    { title: 'หน่วยใหม่' },
    { title: 'หมายเหตุ' }
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
      this.periodService.getAPeroidPay(this.periodID).then(async periodResponse => {
        this.periodInfo = periodResponse['list'][0];
        this.periodInfo['agent'] = JSON.parse(this.periodInfo['agent']);
        this.periodInfo['unit_price'] = parseInt(this.periodInfo['unit_price'], 10).toFixed(2);

        await this.setOleUnit();

      });
    });
    $('#electricalUsedFormTable').DataTable({
      destroy: true,
      columns: this.columns,
      data: []
    });
    this.setTable();
  }

  async setOleUnit() {
    if (this.periodInfo['previous_period'] === -1) {

    } else {
      await this.periodService.getElectricUsedList(this.periodInfo['previous_period']).then(responseOldList => {
        this.oldElectricMeterList = responseOldList['list'];
      });
    }
  }

  async setTable() {
    this.electricalMeterList = [];
    await this.periodService.getElectricUsedList(this.periodID).then(async (peroidResponse: any[]) => {
      // console.log(peroidResponse);
      await this.setOleUnit();
      await peroidResponse['list'].forEach(async (rows, index) => {
        try {
          // console.log('old: ', this.oldElectricMeterList[index]);
          const offset = (rows['offset'] == null) ? 0 : rows['offset'];
          // tslint:disable-next-line:radix
          const oldUnit = await this.getOldValue(rows['id']);
          const newUnit = (rows['used'] == null) ? 0 : rows['used'];
          const note = (rows['note'] == null) ? '' : rows['note'];

          const tempData = [
            rows['code'],
            rows['text'],
            oldUnit,
            '<input class="offset-unit" id="offset-unit-' + rows['id'] + '" value="' + offset + '" type="number" />',
            '<input class="new-unit" id="new-unit-' + rows['id'] + '" value="' + newUnit + '" type="number" />',
            '<input class="note-unit" id="note-unit-' + rows['id'] + '" value="' + note + '" type="text" />'
          ];
          console.log(tempData);
          this.electricalMeterList.push(tempData);
          $('#electricalUsedFormTable').DataTable({
            destroy: true,
            columns: this.columns,
            data: this.electricalMeterList,
            order: [[0, 'asc']],
            iDisplayLength: -1
          });
        } catch (error) {
          console.log('error', error);
        }
      });
    });
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
          console.log('temp true', temp);
        } else {
          console.log('temp false', temp);
        }
      });
    }
    console.log(temp);
    return temp;
  }

  btnSave() {
    const dataSent = {
      offsetUnit: [],
      newUnit: [],
      noteUnit: []
    };

    const offsetList = $('.offset-unit');
    const newUnitList = $('.new-unit');
    const noteList = $('.note-unit');

    for (let i = 0; i < offsetList.length; i++) {
      // console.log(offsetList[i].id);
      const tempData = { meterID: offsetList[i].id.split('-')[2], value: offsetList[i].value };
      dataSent.offsetUnit.push(tempData);
    }

    for (let i = 0; i < newUnitList.length; i++) {
      // console.log(newUnitList[i].id);
      const tempData = { meterID: newUnitList[i].id.split('-')[2], value: newUnitList[i].value };
      dataSent.newUnit.push(tempData);
    }

    for (let i = 0; i < noteList.length; i++) {
      // console.log(noteList[i].id);
      const tempData = { meterID: noteList[i].id.split('-')[2], value: noteList[i].value };
      dataSent.noteUnit.push(tempData);
    }

    // console.log(dataSent);
    this.periodService.saveElectricUsedList(this.periodID, dataSent).then(response => {
      this.router.navigateByUrl('/ข้อมูลการใช้ไฟฟ้า/' + btoa(this.periodID));
    });
  }

  gotoBack() {
    this.router.navigateByUrl('/ข้อมูลการใช้ไฟฟ้า/' + btoa(this.periodID));
  }

}
