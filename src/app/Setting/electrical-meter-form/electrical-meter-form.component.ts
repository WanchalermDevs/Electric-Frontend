import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElectricalMeterService } from '../../services/electrical-meter.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-electrical-meter-form',
  templateUrl: './electrical-meter-form.component.html',
  styleUrls: ['./electrical-meter-form.component.css']
})
export class ElectricalMeterFormComponent implements OnInit {

  @ViewChild('electricalMeterForm') heroForm: NgForm;

  operate: any;
  code: any = '';
  text: any = '';
  note: any = '';

  constructor(private elecMeter: ElectricalMeterService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.operate = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.operate != null) {
      this.elecMeter.getAnElectricalMeter(this.operate).then(result => {
        if (result['operation'] === 'success') {
          this.heroForm.control.setValue({
            code: result['list'][0]['code'],
            text: result['list'][0]['text'],
            note: result['list'][0]['note']
          });
        }
      });
    }

  }

  formSubmit(form: NgForm) {
    if (this.operate != null) {
      this.elecMeter.editAnElectricalMeter(form['code'], form['text'], form['note'], this.operate).then(response => {
        if (response['operation'] === 'success') {
          this.router.navigateByUrl('/การตั้งค่า/มิเตอร์');
        }
      });
    } else {
      this.elecMeter.createNewElectricalMeter(form['code'], form['text'], form['note']).then(response => {
        if (response['operation'] === 'success') {
          this.router.navigateByUrl('/การตั้งค่า/มิเตอร์');
        }
      });
    }
  }

}
