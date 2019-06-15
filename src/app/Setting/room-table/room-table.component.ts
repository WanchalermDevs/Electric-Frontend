import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { HabitatService } from '../../services/habitat.service';
import swal from 'sweetalert2';


declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare const $: any;
@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.component.html',
  styleUrls: ['./room-table.component.css']
})
export class RoomTableComponent implements OnInit, AfterViewInit {
  dataTable: DataTable;
  @Input() buildingNameList: any;
  nameBuildingArray: any = [];
  roomListForRemove: any = [];

  constructor(private habitatService: HabitatService) {
    this.dataTable = { headerRow: [], footerRow: [], dataRows: [[],] };
  }

  async ngOnInit() {
    setTimeout(() => {
      this.setRoomTable();
    }, 300);
    const table = $('#datatables').DataTable();

    table.on('click', '.roomRemove', (e) => {
      if (e.currentTarget.id != '') {
        swal({
          title: 'ลบข้อมูล!',
          text: 'คุณต้องการลบข้อมูล "' + this.roomListForRemove[e.currentTarget.id] + '" ใช่หรือไม่',
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          cancelButtonText: 'ยกเลิก',
          confirmButtonText: 'ใช่ ลบข้อมูลเดี๋ยวนี้',
          buttonsStyling: false
        }).then((result) => {
          if (result.value) {
            this.removeRoom(e.currentTarget.id);
          }
        });
      }
    });
  }

  async ngAfterViewInit() {

  }

  removeRoom(id) {
    this.habitatService.removeRoom(id).then(response => {
      if (response['operation'] == 'success') {
        this.setRoomTable();
      } else {
        alert('Server ผิดพลาด!');
      }

    });
  }

  setRoomTable(): void {
    this.habitatService.getAllRoom()
      .then(async (rooms: any[]) => {
        try {
          this.buildingNameList.forEach(element => {
            this.nameBuildingArray[element['id']] = element['code'] + '-' + element['text'];
          });
        } catch (error) {
          throw error;
        }

        this.dataTable = {
          headerRow: ['#', 'รหัสห้อง', 'ชื่อห้อง', 'อาคาร'],
          footerRow: ['#', 'รหัสห้อง', 'ชื่อห้อง', 'อาคาร'],
          dataRows: []
        };

        $('#datatables').DataTable({
          destroy: true,
          pagingType: 'full_numbers',
          lengthMenu: [
            [10, 25, 50, -1],
            ['10', '25', '50', 'ทั้งหมด']
          ],
          responsive: true,
          language: {
            lengthMenu: "แสดง _MENU_ ห้องต่อ 1 หน้ารายการ",
            search: '_INPUT_',
            searchPlaceholder: 'ค้นหา...',
            emptyTable: '-- ไม่มีข้อมูลห้องพัก --',
            info: 'กำลังแสดงหน้าที่ _PAGE_ จาก _PAGES_',
          },
          data: await this.setRoomRowArray(rooms),
          select: true,
          columnDefs: [
            { targets: [4], className: 'text-right' }
          ],
        });
      });
  }

  setRoomRowArray(rooms) {
    // tslint:disable-next-line:prefer-const
    let roomArray = [];
    // tslint:disable-next-line:forin
    rooms.forEach((element, index) => {
      // console.log(element);
      // tslint:disable-next-line:max-line-length
      this.roomListForRemove[element['id']] = element['code'] + ' ' + element['text'] + ' อาคาร ' + this.nameBuildingArray[element['parent_id']];
      // tslint:disable-next-line:max-line-length
      const data = [(index + 1), element['code'], element['text'], this.nameBuildingArray[element['parent_id']], '<button mat-raised-button id="' + element['id'] + '" class="btn btn-info roomRemove"><i class="material-icons">delete</i> ลบ</button>'];
      roomArray.push(data);
    });
    return roomArray;
  }

}
