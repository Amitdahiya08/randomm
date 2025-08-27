import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
    next(req).pipe(
        catchError(err => {
            console.error('[HTTP]', err);
            return throwError(() => err);
        })
    );
