import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login-up.component.html',
  styleUrls: ['./login-up.component.css']
})

export class LoginUpComponent implements OnInit  {
  
  email: string = '';
  password: string = '';
  
  nombreAutor: string = '';
  emailAutor: string = '';
  passwordAutor: string = '';
  confirmPasswordAutor: string = '';
  
  errorLogin: boolean = false;
  errorRegister: boolean = false
  successRegister: boolean = false
  errorRegisterMessage: string = ''
  successRegisterMessage: string = ''
  messageLogin: string = ''

  
  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLogeado()
  }

  isLogeado () {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    if (userData && userData.nombre && userData.email) {
      this.router.navigate(['profile'])
    }
  }

  validateRegisterAutor () {
    if (!this.nombreAutor || this.nombreAutor === "") {
      return {
        error: true,
        message: 'Nombre Requerido'
      }
    } else if (!this.emailAutor || this.emailAutor === "") {
      return {
        error: true,
        message: 'Email Requerido'
      }
    } else if (!this.passwordAutor || this.passwordAutor === "") {
      return {
        error: true,
        message: 'Contraseña Requerida'
      }
    } else if (this.passwordAutor !== this.confirmPasswordAutor) {
      return {
        error: true,
        message: 'Las contraseñas no coinciden'
      }
    }
    return {
      error: false,
      message: ''
    }
  }

  open(registerModal) {
    this.modalService.open(registerModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {});
  }

  registerUser () {
    const { error, message } = this.validateRegisterAutor()
    if (error) {
      this.errorRegisterMessage = message
      this.errorRegister = true
      setTimeout(() => {
        this.errorRegister = false
        this.errorRegisterMessage = ''
      }, 2900);
    } else {
      try {
        const payloadCreateAutor = {
          nombre: this.nombreAutor,
          email: this.emailAutor,
          password: this.passwordAutor
        }
        this.httpClient
        .post('http://localhost:3000/api/autor', payloadCreateAutor)
        .subscribe((responseCreateAutor: any) => {
          if (responseCreateAutor) {
            this.successRegisterMessage = responseCreateAutor.message
            this.successRegister = true
            setTimeout(() => {
              this.successRegisterMessage = ''
              this.successRegister = false
            }, 2500);
          }
        }, err => {
          this.errorRegisterMessage = err.message
          this.errorRegister = true
          setTimeout(() => {
            this.errorRegister = false
            this.errorRegisterMessage = ''
          }, 2900);
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  loginSesionUser () {
    if (this.email === "" || this.password === "") {
      this.errorLogin = true
      setTimeout(() => {
        this.errorLogin = false
      }, 3000);
    } else {
      try {
        const payloadObject = {
          email: this.email,
          password: this.password
        }
        this.httpClient
          .post('http://localhost:3000/api/autor/login', payloadObject)
          .subscribe((responseLogin: any) => {
            if (responseLogin && responseLogin.data._id) {
              const saveStorage = {
                id: responseLogin.data._id,
                nombre: responseLogin.data.nombre,
                email: responseLogin.data.email
              }
              localStorage.setItem('user_data', JSON.stringify(saveStorage))
              this.router.navigate(['profile'])
            }
          }, (error: any) => {
            console.log(error)
            if (error.status === 400 || error.status === 404 || error.status === 500) {
              this.errorLogin = true
              this.messageLogin = error.error.message || 'Error'
              setTimeout(() => {
                this.errorLogin = false
                this.messageLogin = ''
              }, 2000);
            }
          });
      } catch (error) {
        console.log(error)
      }
    }
  }
}
