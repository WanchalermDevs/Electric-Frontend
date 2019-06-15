import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { HabitatService } from '../../services/habitat.service';
import swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-stores-table',
  templateUrl: './stores-table.component.html',
  styleUrls: ['./stores-table.component.css']
})
export class StoresTableComponent implements OnInit, AfterViewInit {

  @Input() buildingNameList: any;
  nameBuildingArray: any = [];
  storesListForRemove: any = [];

  tableHeader = [
    { data: '#', targets: 0 },
    { data: 'รหัสร้าน', targets: 1 },
    { data: 'ชื่อร้าน', targets: 2 },
    { data: 'อาคาร', targets: 3 }
  ];

  constructor(private habitatService: HabitatService) {
    $('#datatables-stores').DataTable({ data: [] });
  }

  async ngOnInit() {
    setTimeout(() => {
      this.setStoresTable();
      $('#datatables-stores').on('click', '.storesRemove', (e) => {
        if (e.currentTarget.id != '') {
          swal({
            title: 'ลบข้อมูล!',
            text: 'คุณต้องการลบข้อมูล "' + this.storesListForRemove[e.currentTarget.id] + '" ใช่หรือไม่',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ใช่ ลบข้อมูลเดี๋ยวนี้',
            buttonsStyling: false
          }).then((result) => {
            if (result.value) {
              this.removeStores(e.currentTarget.id);
            }
          });
        }
      });

    }, 300);


  }

  async ngAfterViewInit() {

  }

  setStoresTable() {
    this.habitatService.getAllStores().then(async response => {
      try {
        this.buildingNameList.forEach(element => {
          this.nameBuildingArray[element['id']] = element['code'] + '-' + element['text'];
        });
      } catch (error) {
        throw error;
      }

      $('#datatables-stores').DataTable({
        destroy: true,
        pagingType: 'full_numbers',
        lengthMenu: [
          [10, 25, 50, -1],
          ['แสดง 10', 'แสดง 25', 'แสดง 50', 'แสดงทั้งหมด']
        ],
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'ค้นหา...',
          emptyTable: '-- ไม่มีข้อมูลร้านค้า --',
        },
        data: await this.setStiresRowArray(response),
        columns: [
          { title: "#" },
          { title: "รหัสร้านค้า" },
          { title: "ชื่อร้านค้า" },
          { title: "อาคาร/สถานที่" },
          { title: "" },
        ],
        select: true,
        columnDefs: [
          { targets: [4], className: 'text-right disabled-sorting' }
        ],
      });
    });
  }

  removeStores(id) {
    this.habitatService.removeRoom(id).then(response => {
      if (response['operation'] == 'success') {
        this.setStoresTable();
      } else {
        alert('Server ผิดพลาด!');
      }

    });
  }

  setStiresRowArray(stores) {
    let storesArray = [];
    stores.forEach((element, index) => {
      // this.store
      // tslint:disable-next-line:max-line-length
      this.storesListForRemove[element['id']] = element['code'] + ' ' + element['text'] + ' อาคาร ' + this.nameBuildingArray[element['parent_id']];
      // tslint:disable-next-line:max-line-length
      const data = [(index + 1), element['code'], element['text'], this.nameBuildingArray[element['parent_id']], '<button mat-raised-button id="' + element['id'] + '" class="btn btn-info storesRemove"><i class="material-icons">delete</i> ลบ</button>'];
      storesArray.push(data);
    });
    return storesArray;
  }

}