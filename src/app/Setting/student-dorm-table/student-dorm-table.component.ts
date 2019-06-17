import { Component, OnInit } from '@angular/core';
import { HabitatService } from '../../services/habitat.service';
import { DormitoryLiveService } from '../../services/dormitory-live.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-student-dorm-table',
  templateUrl: './student-dorm-table.component.html',
  styleUrls: ['./student-dorm-table.component.css']
})
export class StudentDormTableComponent implements OnInit {

  studentDormList: any = [];
  table: any;
  lengthSelected: any = 0;

  buildingList: any = [];
  roomList: any = [];

  searchYear: any = '';
  searchSemester: any = '';

  columnsTable = [
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
    { title: 'รหัสนักเรียน' },
    { title: 'ชื่อ - นามสกุล' },
    { title: 'ห้อง' },
  ];

  constructor(
    private habitatService: HabitatService,
    private dormitoryLiveService: DormitoryLiveService,
    private router: Router
  ) {

  }

  ngOnInit() {
    $('#studentDormTable').DataTable({
      destroy: true,
      columns: this.columnsTable,
      data: null,
    });
    this.habitatService.getAllBuilding().then((buildingResponse: any = []) => {
      if (buildingResponse['list'].length > 0) {
        buildingResponse['list'].forEach(element => {
          this.buildingList[element['id']] = element;
        });
        this.habitatService.getAllRoom().then((roomResponse: any = []) => {
          if (roomResponse.length > 0) {
            roomResponse.forEach(room => {
              this.roomList[room['id']] = room;
            });
            this.setTable();
          }
        });
      }
    });

    this.table = $('#studentDormTable').DataTable();

    $('#studentDormTable thead').on('click', 'tr th:eq(0)', function () {
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

    $('#studentDormTable tbody').on('click', 'tr', function (e) {
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
    if (this.searchSemester !== '' && this.searchYear !== '') {
      this.lengthSelected = 0;
      this.studentDormList = [];
      this.dormitoryLiveService.getAllStudentDorm(this.searchYear, this.searchSemester).then((studentDormListResponse: any = []) => {
        if (studentDormListResponse['list'].length > 0) {
          studentDormListResponse['list'].forEach((element, index) => {
            const tempRoomName = this.roomList[element['habitat_id']]['code'];
            const buildingName = this.buildingList[this.roomList[element['habitat_id']]['parent_id']]['text'];
            const temp = [
              element['id'],
              (index + 1),
              element['student_code'],
              element['student_name'],
              buildingName + '-' + tempRoomName + '-' + element['room']
            ];
            this.studentDormList.push(temp);
          });
          $('#studentDormTable').DataTable({
            destroy: true,
            columns: this.columnsTable,
            data: this.studentDormList,
            order: [[1, 'asc']],
            select: true
          });
        } else {
          $('#studentDormTable').DataTable({
            destroy: true,
            columns: this.columnsTable,
            data: this.studentDormList,
            order: [[1, 'asc']],
            select: true
          });
        }
      });
    }

  }

  tableClick() {
    this.table = $('#studentDormTable').DataTable();
    // let element = document.getElementsByClassName('selected');
    let element = $('.selected');
    this.lengthSelected = element.length;
    if (this.lengthSelected !== this.studentDormList.length) {
      $('#checkAll')[0].checked = false;
    } else {
      $('#checkAll')[0].checked = true;
    }
  }

  gotoElectricalMeterForm() {
    this.router.navigateByUrl('/การตั้งค่า/แบบฟอร์มนักเรียนหอพัก');
  }

  goToEdit() {
    const id = $('.selected')[0].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value;
    this.router.navigateByUrl('/การตั้งค่า/แบบฟอร์มมิเตอร์ไฟฟ้า/' + id);
  }

  removeMeter() {
    swal({
      title: 'ลบข้อมูล!',
      text: 'คุณต้องการลบข้อมูลนักเรียนหอพักจำนวน ' + this.lengthSelected + ' คนใช่หรือไม่',
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
          this.dormitoryLiveService.removeStudentDorm(remove[i].getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value).then(() => {
            this.setTable();
          });
        }
      }
    });
  }


}
