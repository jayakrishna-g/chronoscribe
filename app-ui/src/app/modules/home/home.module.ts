import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule } from '@angular/material/legacy-input';

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        MatLegacyFormFieldModule,
        ReactiveFormsModule,
        MatLegacyCardModule,
        MatLegacyInputModule,
        HomeComponent,
    ],
    providers: [],
})
export class HomeModule {}
