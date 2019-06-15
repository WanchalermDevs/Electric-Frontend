import { Component, OnInit } from '@angular/core';
import { PeriodService } from '../../../services/period.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { PDFGenteratorService } from '../../../services/pdfgenterator.service';
import { saveAs } from 'file-saver';

declare const $: any;

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent implements OnInit {

  periodPayList: any[] = [];
  idSelectedList: any[] = [];
  lengthSelected: any = 0;
  table: any;

  columns = [
    {
      // title: '',
      // orderable:false,
      // tslint:disable-next-line:max-line-length
      title: '<div class="form-check"><input class="form-check-input" value="" id="checkAll" type="checkbox" ><span class="form-check-sign"><span class="check"></span></div>',
      data: 'active',
      orderable: false,
      render: function (data, type, row) {
        if (type === 'display') {
          // tslint:disable-next-line:max-line-length
          return '<div class="form-check"><input class="form-check-input" value="' + row[0] + '" type="checkbox" ><span class="form-check-sign"><span class="check"></span></div>';
        }
        return type;
      }
    },
    { title: '#', width: '2%' },
    { title: 'ปรับปรุงข้อมูลเมื่อ' },
    { title: 'รหัส' },
    { title: 'รอบบัญชี', width: '35%' },
    { title: 'ปีการศึกษา' },
    { title: 'ภาคเรียน' },
    { title: 'วันชำระวันแรก' },
    { title: 'วันชำระวันสุดท้าย' },
    { title: 'ผู้ตั้ง' }
  ];

  constructor(private periodService: PeriodService, private router: Router, private pdfGenterator: PDFGenteratorService) { }

  gotoViewPeriodInfo() {
    const id = $('.selected')[0].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value;
    this.router.navigateByUrl('/การตั้งค่า/รอบบัญชี/ข้อมูล/' + id);
    // const filename = 'testFile-2.pdf';
    // this.pdfGenterator.downloadReport(filename).subscribe(
    //   (data) => {
    //     console.log(data);
    //     // saveAs(data, filename);
    //     const a = document.createElement('a');
    //     // a.style = "display: none";
    //     const blob = new Blob([data.blob()], {type: 'octet/stream'});
    //     const url = window.URL.createObjectURL(blob);
    //     a.href = url;
    //     a.download = filename;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   },
    //   err => {
    //     alert('Problem while downloading the file.');
    //     console.error(err);
    //   }
    // );
  }

  ngOnInit() {
    $('#periodTable').DataTable({
      destroy: true,
      columns: this.columns,
      data: null
    });

    $('#periodTable thead').on('click', 'tr th:eq(0)', function () {
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

    $('#periodTable tbody').on('click', 'tr', function (e) {
      $(this).toggleClass('selected');
      // console.log(this.getElementsByTagName('td')[0]);
      const element = this.getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0];
      if (element.checked) {
        element.checked = false;
      } else {
        element.checked = true;
      }
    });
    this.table = $('#periodTable').DataTable();
    this.setTable();
  }

  setTable() {
    this.periodService.getAllPeriodPay().then(response => {
      this.lengthSelected = 0;
      this.periodPayList = [];
      if (response['operation'] === 'success') {
        response['list'].forEach((element, index) => {
          // tslint:disable-next-line:max-line-length
          const data = [element['id'], (index + 1), element['timestamp_update'], element['code'], element['name'], element['edu_year'], element['edu_semester'], element['date_start_pay'], element['date_last_pay'], element['operated_person']];
          this.periodPayList.push(data);
        });
        $('#periodTable').DataTable({
          destroy: true,
          columns: this.columns,
          data: this.periodPayList,
          order: [[1, 'asc']],
        });
      }
    });
  }

  gotoEdit() {
    const id = $('.selected')[0].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value;
    console.log(id);
    this.router.navigateByUrl('/การตั้งค่า/รอบบัญชี/แบบอฟร์ม/' + id);
  }

  tableClick() {
    const element = $('.selected');
    this.lengthSelected = element.length;
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
          this.periodService.deleteAPeroidPay(remove[i].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value).then(deleteResponse => {
            this.setTable();
          });
        }
      }
    });
  }

}
