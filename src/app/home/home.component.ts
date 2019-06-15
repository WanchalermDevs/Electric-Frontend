import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ElectricalMeterService } from '../services/electrical-meter.service';
import { HabitatService } from '../services/habitat.service';
import { PeriodService } from '../services/period.service';

declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {

  periodList: any[] = [];
  idSelectedList: any[] = [];
  lengthSelected: any = 0;
  table: any;
  buildingList: any = [];

  columns = [
    { title: 'สถานะ', orderable: false },
    { title: 'รหัสรอบบัญชี' },
    { title: 'รอบชัญชี' },
    { title: 'เริ่มชำระ' },
    { title: 'เริ่มดาวน์โหลด' },
    { title: 'รวมหน่วย' },
    { title: 'รวมเงิน' },
    { title: 'ดำเนินการ' }
  ];

  constructor(
    private router: Router,
    private electicalMeterService: ElectricalMeterService,
    private habitatService: HabitatService,
    private periodService: PeriodService
  ) { }

  ngOnInit() {
    $('#usageElectricityTable').DataTable({
      destroy: true,
      columns: this.columns,
      data: null
    });
    $('#usageElectricityTable tbody').on('click', 'a', function () {
      // console.log(this);
      // console.log('id', this.id);
      // location.href = '/ข้อมูลการใช้ไฟฟ้า/' + this.id;
    });
    this.table = $('#usageElectricityTable').DataTable();
    this.setTable();
  }

  tableClick(t, event) {
    this.router.navigateByUrl('/ข้อมูลการใช้ไฟฟ้า/' + event.target.id);
  }

  setTable() {
    this.buildingList = [];
    this.periodList = [];
    this.lengthSelected = 0;
    this.periodService.getAllPeriodPay().then((peroidResponse: any[]) => {
      console.log(peroidResponse['list']);
      peroidResponse['list'].forEach((rows, index) => {
        try {
          // tslint:disable-next-line:max-line-length
          const tempData = [rows['status'] == '' ? 'ยังไม่สมบูรณ์' : 'สมบูรณ์แล้ว', rows['code'], rows['name'], rows['date_start_pay'], rows['date_start_download'], '0.00', '0.00', '<a id="' + btoa(rows['id'] + '') + '" class="btn btn-info btn-operate">ดำเนินการ</a>'];
          this.periodList.push(tempData);

        } catch (error) {
        }
      });
      $('#usageElectricityTable').DataTable({
        destroy: true,
        columns: this.columns,
        data: this.periodList,
        order: [[1, 'asc']],
      });
    });
  }

}
