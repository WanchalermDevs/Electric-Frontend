import { HabitatService } from './../../../services/habitat.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  storesList = [];
  idSelectedList: any[] = [];
  lengthSelected: any = 0;
  table: any;
  buildingList: any = [];

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
    { title: '#', orderable: false },
    { title: 'รหัสร้านค้า' },
    { title: 'ชื่อร้านค้า', width: '40%' },
    { title: 'อาคาร' }
  ];

  constructor(private router: Router, private habitatService: HabitatService) { }

  ngOnInit() {
    $('#storesTable').DataTable({
      destroy: true,
      columns: this.columns,
      data: null
    });

    $('#storesTable thead').on('click', 'tr th:eq(0)', function () {
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

    $('#storesTable tbody').on('click', 'tr', function (e) {
      $(this).toggleClass('selected');
      // console.log(this.getElementsByTagName('td')[0]);
      const element = this.getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0];
      if (element.checked) {
        element.checked = false;
      } else {
        element.checked = true;
      }
    });

    this.table = $('#storesTable').DataTable();

    this.setTable();

  }

  tableClick() {
    const element = $('.selected');
    this.lengthSelected = element.length;
  }

  setTable() {
    this.buildingList = [];
    this.storesList = [];
    this.lengthSelected = 0;
    this.setBuildingSelector(() => {
      this.habitatService.getAllStores().then((rooms: any[]) => {
        var count = 1;
        rooms.forEach((rows, index) => {
          try {
            if (undefined !== this.buildingList[rows['parent_id']]) {
              const tempData = [rows['id'], (count++), rows['code'], rows['text'], this.buildingList[rows['parent_id']]];
              this.storesList.push(tempData);
            } else {
            }
          } catch (error) {
          }
        });
        $('#storesTable').DataTable({
          destroy: true,
          columns: this.columns,
          data: this.storesList,
          order: [[1, 'asc']],
        });
      });
    });
  }

  removeRow() {
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
          this.habitatService.removeRoom(remove[i].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value).then(deleteResponse => {
            this.setTable();
          });
        }
      }
    });
  }

  setBuildingSelector(cb) {
    this.habitatService.getAllBuilding().then(async response => {
      if (response['operation'] === 'success') {
        // this.buildingList = response['list'];
        await response['list'].forEach(element => {
          this.buildingList[element['id']] = element['text'];
        });
        cb();
      } else {

      }
    });
  }

}
