import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyCard as MatCard, MatLegacyCardModule } from '@angular/material/legacy-card';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { RouteConfigLoadStart, Router } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { FlexModule } from '@angular/flex-layout/flex';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  standalone: true,
  imports: [
    MatLegacyCardModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyButtonModule,
  ],
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
