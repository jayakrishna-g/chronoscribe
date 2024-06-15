import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  constructor(@Inject(ToastrService) private toasterService: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          console.log(evt);
          if (evt.body && evt.body.message) {
            this.toasterService.success(evt.body.message, evt.body.title, { positionClass: 'toast-top-right' });
          }
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          try {
            if (err.error.message.length === 0) {
              err.error.message = 'Unknown Error Occured';
            }
            this.toasterService.error(err.error.message, err.error.title, {
              positionClass: 'toast-top-right',
            });
          } catch (e) {
            this.toasterService.error('An error occurred', '', {
              positionClass: 'toast-top-right',
            });
          }
          //log error
        }
        return of(err);
      })
    );
  }
}
