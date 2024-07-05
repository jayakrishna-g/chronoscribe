import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  standalone: true,
  imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class PasswordResetComponent implements OnInit {
  PassResetForm!: UntypedFormGroup;
  constructor(
    @Inject(UntypedFormBuilder)
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    @Inject(Router)
    private router: Router
  ) {}
  ngOnInit() {
    this.createResetForm();
  }

  passwordReset() {
    this.authenticationService.passReset(this.PassResetForm.value).subscribe((res) => {
      if (res.status) this.router.navigate(['/login']);
    });
  }
  private createResetForm() {
    this.PassResetForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });
  }
}
