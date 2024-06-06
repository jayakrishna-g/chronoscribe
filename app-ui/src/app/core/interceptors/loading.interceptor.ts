import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.method === 'GET') {
      this.loadingService.setLoading(true, request.url);
    }
    return next.handle(request).pipe(
      finalize(() => {
        console.log('Check');
        if (request.method === 'GET') {
          this.loadingService.setLoading(false, request.url);
        }
      })
    );
  }
}
