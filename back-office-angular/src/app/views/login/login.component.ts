import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToasterComponent, ToasterPlacement} from "@coreui/angular";
import {LoginService} from "../../service/login/login.service";
import Swal, {SweetAlertIcon} from "sweetalert2";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    placement = ToasterPlacement.MiddleCenter;
    @ViewChild(ToasterComponent) toaster !: ToasterComponent;
    loginForm !: FormGroup;

    clicked = false;

    constructor(
      private formBuilder: FormBuilder,
      private service: LoginService,
      private router: Router
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['admin@example.com', Validators.required],
            password: ['admin', Validators.required],
        });
    }

    onSubmit() {
      this.clicked = true;
        if (this.loginForm.valid) {

          this.service.login(this.loginForm.value).subscribe({
            next: res => {
              console.log("success");
              sessionStorage.setItem("admin", JSON.stringify(res.data.entity));
              sessionStorage.setItem("tk", res.data.token);
              this.router.navigate(["/dashboard"]).then(() => console.log("redirected")).catch((r) => console.log(r));
              this.clicked = false;
            },
            error: err => {
              Swal.fire({
                title: "Erreur",
                icon: 'error' as SweetAlertIcon,
                text: err.error.message,
                showCloseButton: true
              });
              this.clicked = false;
            }
          })

        }
        else {
          this.clicked = false;
        }
    }

}
