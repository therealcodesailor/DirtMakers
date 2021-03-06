import { Injectable }               from '@angular/core';
import { Http, Headers, Response }  from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import { Router }                   from '@angular/router';
import                              'rxjs/add/observable/of';
import                              'rxjs/add/operator/do';
import                              'rxjs/add/operator/delay';
import { Account }                  from '../models/account';
import { Subject }                  from 'rxjs/Subject';

/**
 * 
 * referenced the following for this: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.x4391hmxd
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {

  private logoutEventSubj = new Subject<string>();
  private resourcePath:string = "/app/resources/";

  public logoutEvent = this.logoutEventSubj.asObservable();
  public isLoggedIn: boolean = false;
  public redirectUrl: string;

  constructor(private http:Http, private router:Router) {
  }

  private getAccounts(): Observable<Account[]> {
    var fileName = this.resourcePath + "security.json";
    return this.http.get(fileName).map(this.extractData); //.catch(this.handleError);
  }

  login(username:string, password:string) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
  
    this.getAccounts().map((result:Account[]) => {
      console.log("checking...");
      for (let idx in result) {
        console.log(result[idx]);
        if(result[idx].username == username && result[idx].password == password) {
          this.isLoggedIn = true;
        }
      }
    });
    return Observable.of(true).do(val => this.isLoggedIn = true);

    // return this.http
    //   .post(
    //     '/login', 
    //     JSON.stringify({ username, password }), 
    //     { headers }
    //   )
    //   .map(res => res.json())
    //   .map((res) => {
    //     if (res.success) {
    //       localStorage.setItem('auth_token', res.auth_token);
    //       this.isLoggedIn = true;
    //     }

      //   return res.success;
      // });

    //return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  }

  logout() {
    console.log("AuthService::logout");
    this.logoutEventSubj.next("logging out");
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  protected handleError(error: Response) {
    console.error('An error occurred', error);
    return Observable.throw(error.json().error);
  }

}