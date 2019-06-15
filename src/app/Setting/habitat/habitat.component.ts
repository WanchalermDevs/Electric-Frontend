import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as Chartist from 'chartist';

declare interface MenuOption {
  icon: string;
  name: string;
  link: string;
}

@Component({
  selector: 'app-habitat',
  templateUrl: './habitat.component.html',
  styleUrls: ['./habitat.component.css']
})
export class HabitatComponent implements OnInit {
  menuOption: MenuOption[];



  constructor(private router: Router) {
    

  }

  ngOnInit() {
    this.menuOption = [
      { icon: 'add', name: 'ข้อมูลอาคาร', link: '/การตั้งค่า/เพิ่มข้อมูลอาคาร' },
      { icon: 'add', name: 'ข้อมูลห้อง', link: '/การตั้งค่า/เพิ่มข้อมูลห้อง' }
    ];

    const dataPreferences = {
      labels: ['62%', '32%', '6%'],
      series: [62, 32, 6]
    };

    const optionsPreferences = {
      height: '230px'
    };

    // tslint:disable-next-line:no-unused-expression
    new Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);

  }

  routerLink(link) {
    // alert(link);
    this.router.navigateByUrl(link);
  }

}
