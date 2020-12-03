import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailValidator, rePasswordValidatorFactory } from 'src/app/shared/validators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../form-styles.css']
})
export class RegisterComponent implements OnInit {

  isLoading = false;

  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    const passwordControl = this.fb.control('', [Validators.required, Validators.minLength(4)]);
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, emailValidator]],
      tel: [''],
      password: passwordControl,
      rePassword: ['', [Validators.required, Validators.minLength(4), rePasswordValidatorFactory(passwordControl)]],
    });
  }

  ngOnInit(): void {
  }

  submitHandler(): void {
    const data = this.form.value;
    this.isLoading = true;
    this.userService.register(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
