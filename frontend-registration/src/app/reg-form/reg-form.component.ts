import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateUserService } from '../services/createUser.service';

@Component({
  selector: 'app-reg-form',
  templateUrl: './reg-form.component.html',
  styleUrls: ['./reg-form.component.scss'],
})
export class RegFormComponent implements OnInit {
  form: FormGroup;

  constructor(private createUserService: CreateUserService,private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, { validators: [Validators.required] }), //Validators.pattern('^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$')
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      fullName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  comparePassword() {
    if (this.form.get('password') != this.form.get('confirmPassword')) {
      return 'Please enter same password as above.';
    }
  }

  getErrorMessage() {
    if (this.form.get('email').hasError('required')) {
      return 'You must enter a email';
    }

    return this.form.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {
    // console.log(this.form)
    this.createUserService.postCreateUser(
      this.form.value.username,
      this.form.value.password,
      this.form.value.fullName,
      this.form.value.email
    ).subscribe((res:any) => {
      console.log(res);
      if (res.created){
        this._snackBar.openFromComponent(SnackBarComponent, {
          duration: 5000,
          panelClass: ['grey-snackbar']
        });
      } else{
        this._snackBar.openFromComponent(SnackBarErrorComponent, {
          duration: 5000,
          panelClass: ['grey-snackbar']
        });
      }

    }, err=> {
      console.log(err);
    });
  }

  clearForm() {
    this.form.reset();
  }
}

@Component({
  selector: 'snack-bar-component',
  template: `<span class="example-pizza-party">
  Account created Sucessfully !! 😃😃
</span>`,
  styles: [`
    .example-pizza-party {
      color: yellow;
    }
  `],
})
export class SnackBarComponent {}

@Component({
  selector: 'snack-bar-component',
  template: `<span class="pizza-party">
  Something Went Wrong or Username already taken!! 😕😕
</span>`,
  styles: [`
    .pizza-party {
      color: #F44336;
    }
  `],
})
export class SnackBarErrorComponent {}