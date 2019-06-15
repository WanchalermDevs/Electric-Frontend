import { Component, OnInit } from '@angular/core';
import { HabitatService } from '../../services/habitat.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-level-setting',
  templateUrl: './level-setting.component.html',
  styleUrls: ['./level-setting.component.css']
})
export class LevelSettingComponent implements OnInit {

  buildingList: any = [];

  constructor(private habitatService: HabitatService) { }

  ngOnInit() {
    this.setSelectBuilding();
  }

  setSelectBuilding() {
    this.habitatService.getAllBuilding().then(response => {
      if (response['operation'] === 'success') {
        this.buildingList = response['list'];
      }
    });
  }

  onSubmit(roomForm: NgForm) {
    console.log(roomForm);
  }

}
