import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-reg-form',
  templateUrl: './reg-form.component.html',
  styleUrls: ['./reg-form.component.scss']
})
export class RegFormComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor() { }

  ngOnInit(): void {
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
