import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

//Angular convention to inject interceptors and provide it in the app.module.ts which is different from other user created services which can be provided directly in the injectable decorator
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      //"Bearer" could be ommitted, it's just a general convention. Authorization header should match the authorization header set in ther backend though it's not case sensitive
      //Mkae sure to add "Authorization" header in your api "Access-Control-Allow-Headers" as an acceptable header
      headers: req.headers.set("Authorization", " " + authToken)

    });
    // console.log(authToken);
    // console.log(authRequest);
    return next.handle(authRequest);
  }
}
