import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitatService } from '../../../services/habitat.service';
import { ElectricalMeterService } from '../../../services/electrical-meter.service';
import swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  roomsList: any[] = [];
  idSelectedList: any[] = [];
  lengthSelected: any = 0;
  table: any;
  buildingList: any = [];
  meterList: any[];

  roomList: any = [];

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
    { title: 'รหัสห้อง' },
    { title: 'ชื่อห้อง', width: '30%' },
    { title: 'อาคาร' },
    { title: 'มิเตอร์ไฟฟ้า', width: '20%' }
  ];

  constructor(private router: Router, private habitatService: HabitatService, private electricalMeterService: ElectricalMeterService) { }

  async ngOnInit() {
    $('#roomsTable').DataTable({
      destroy: true,
      columns: this.columns,
      data: null
    });

    $('#roomsTable thead').on('click', 'tr th:eq(0)', function () {
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

    $('#roomsTable tbody').on('click', 'tr', function (e) {
      $(this).toggleClass('selected');
      // console.log(this.getElementsByTagName('td')[0]);
      const element = this.getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0];
      if (element.checked) {
        element.checked = false;
      } else {
        element.checked = true;
      }
    });
    this.table = $('#roomsTable').DataTable();

    this.setTable();
  }

  getMeterInfo(id) {
    for (let i = 0; i < this.meterList.length; i++) {
      if (this.meterList[i]['id'] === id) {
        return this.meterList[i]['code'] + '-' + this.meterList[i]['text'];
      }
    }
    return 'none';
  }

  setMeterList() {
    this.electricalMeterService.getElecticalMeterList().then(responseMeter => {
      if (responseMeter['operation'] === 'success') {
        this.meterList = responseMeter['list'];
      } else {

      }
    });
  }

  tableClick() {
    const element = $('.selected');
    this.lengthSelected = element.length;
  }

  async setTable() {
    await this.setMeterList();
    console.log(this.meterList);
    this.buildingList = [];
    this.roomsList = [];
    this.lengthSelected = 0;
    this.setBuildingSelector(() => {
      this.habitatService.getAllRoom().then((rooms: any[]) => {
        let count = 1;
        rooms.forEach(async (rows, index) => {
          try {
            if (undefined !== this.buildingList[rows['parent_id']]) {
              // tslint:disable-next-line:max-line-length
              const tempData = [rows['id'], (count++), rows['code'], rows['text'], this.buildingList[rows['parent_id']], await this.getMeterInfo(rows['meter_id'])];
              console.log(tempData);
              this.roomsList.push(tempData);
              $('#roomsTable').DataTable({
                destroy: true,
                columns: this.columns,
                data: this.roomsList,
                order: [[1, 'asc']],
              });
            } else {
            }
          } catch (error) {
          }
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
