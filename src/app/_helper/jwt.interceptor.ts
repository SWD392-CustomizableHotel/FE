import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../assets/environments/environment';
import { AuthenticationService } from '../services/authentication.service';
import { GoogleCommonService } from '../services/google-common.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private googleCommonService: GoogleCommonService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        const googleUser = this.googleCommonService.userSocialValue;
        const token = user?.token || googleUser?.token;
        const isLoggedIn = !!token;
        const isApiUrl = request.url.startsWith(environment.BACKEND_API_URL);

        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);
    }
}