import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // json-server doesn't require token; keep hook for future.
    return next(req);
};
