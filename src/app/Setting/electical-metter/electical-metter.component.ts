import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectricalMeterService } from '../../services/electrical-meter.service';
import { async } from 'rxjs/internal/scheduler/async';
import swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-electical-metter',
  templateUrl: './electical-metter.component.html',
  styleUrls: ['./electical-metter.component.css']
})
export class ElecticalMetterComponent implements OnInit {

  idSelectedList: any[] = [];
  meterList: any[] = [];
  table: any;
  lengthSelected: any = 0;
  columns = [
    {
      // tslint:disable-next-line:max-line-length
      title: '<div class="form-check"><input class="form-check-input" id="checkAll" type="checkbox" ><span class="form-check-sign"><span class="check"></span></div>',
      data: 'active',
      orderable: false,
      render: (data, type, row) => {
        if (type === 'display') {
          // tslint:disable-next-line:max-line-length
          return '<div class="form-check"><input class="form-check-input" value="' + row[0] + '" type="checkbox" ><span class="form-check-sign"><span class="check"></span></div>';
        }
        return type;
      }
    },
    { title: '#' },
    { title: 'ปรับปรุงข้อมูลเมื่อ' },
    { title: 'รหัสมิเตอร์' },
    { title: 'ชื่อ' },
    { title: 'หมายเหตุ' }
  ];

  constructor(private router: Router, private elecMeter: ElectricalMeterService) {

  }

  ngOnInit() {
    $('#meter-table').DataTable({
      destroy: true,
      columns: this.columns,
      data: null,
    });
    this.setTable();
    this.table = $('#meter-table').DataTable();

    $('#meter-table thead').on('click', 'tr th:eq(0)', function () {
      // Select All
      if ($('.form-check-input')[0].checked) {
        // remove all list
        for (let i = 0; i < $('.form-check-input').length; i++) {
          $('.form-check-input')[i].checked = false;
        }
        $('tbody tr').removeClass('selected');
      } else {
        // check all list
        for (let i = 0; i < $('.form-check-input').length; i++) {
          $('.form-check-input')[i].checked = true;
        }
        $('tbody tr').addClass('selected');
      }
    });

    $('#meter-table tbody').on('click', 'tr', function (e) {
      $(this).toggleClass('selected');
      // console.log(this.getElementsByTagName('td')[0]);

      const element = this.getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0];
      if (element.checked) {
        element.checked = false;
      } else {
        element.checked = true;
      }
    });
  }

  setTable() {
    this.elecMeter.getElecticalMeterList().then(response => {
      this.meterList = [];
      this.lengthSelected = 0;
      const tempMeter = response['list'];
      tempMeter.forEach((element, index) => {
        const temp = [element['id'], (index + 1), element['timestamp_update'], element['code'], element['text'], element['note']];
        this.meterList.push(temp);
      });
      $('#meter-table').DataTable({
        destroy: true,
        columns: this.columns,
        data: this.meterList,
        order: [[1, 'asc']],
        select: true
      });
    });
  }

  tableClick() {
    this.table = $('#myTable').DataTable();
    // const element = document.getElementsByClassName('selected');
    const element = $('.selected');
    this.lengthSelected = element.length;
    if (this.lengthSelected !== this.meterList.length) {
      $('#checkAll')[0].checked = false;
    } else {
      $('#checkAll')[0].checked = true;
    }
  }

  gotoElectricalMeterForm() {
    this.router.navigateByUrl('/การตั้งค่า/แบบฟอร์มมิเตอร์ไฟฟ้า');
  }

  goToEdit() {
    const id = $('.selected')[0].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value;
    this.router.navigateByUrl('/การตั้งค่า/แบบฟอร์มมิเตอร์ไฟฟ้า/' + id);
  }

  removeMeter() {
    swal({
      title: 'ลบข้อมูล!',
      text: 'คุณต้องการลบข้อมูลมิเตอร์ไฟฟ้าที่เลือกจำนวน ' + this.lengthSelected + ' รายการใช่หรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ใช่ ลบเดี๋ยวนี้',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        const remove = $('.selected');
        for (let i = 0; i < remove.length; i++) {
          // tslint:disable-next-line:max-line-length
          this.elecMeter.removeElectricalMeter(remove[i].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value).then(() => {
            this.setTable();
          });
        }
      }
    });
  }
}
