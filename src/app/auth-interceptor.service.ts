import { HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next) {
        const modifiedRequest = req.clone({ headers: req.headers.append('Auth', 'xyz') });
        return (<Observable<any>>next.handle(modifiedRequest));
    }
}