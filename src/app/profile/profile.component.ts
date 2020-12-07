import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  autorId: string = ''
  autorNombre: string = ''
  autorEmail: string = ''

  createMessage: string = ''
  booleanCreate: boolean = false
  booleanUpdate: boolean = false
  toastMessage: string = ''
  showToastCreatetask: boolean = false
  toastMessageDanger: string = ''
  showToastDanger: boolean = false
  updateMessage: string = ''

  nombreTarea: string = ''
  prioridadTarea: string = ''
  fechaTarea: Date = new Date()

  tasks: any[]

  idTaskDelete: string = ''
  nombreTaskDelete: string = ''


  idTareaUpdate: string = ''
  nombreTareaUpdate: string = ''
  prioridadTareaUpdate: string = ''
  fechaTareaUpdate: Date = new Date()
  completedTareaUpdate: boolean = false

  // References Modal
  modalTaskReference: NgbModalRef
  modalDeleteReference: NgbModalRef
  modalUpdateReference: NgbModalRef
  


  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLogeado()
  }

  editarTask (task, updateTaskModal) {
    this.idTareaUpdate = task._id
    this.nombreTareaUpdate = task.nombre
    this.prioridadTareaUpdate = task.prioridad
    this.fechaTareaUpdate = task.fecha
    this.completedTareaUpdate = task.completed ? true : false
    this.modalUpdateReference = this.modalService.open(updateTaskModal)
  }

  tagPrioridad (task) {
    let tag = ''
    if (task.prioridad === 5) {
      tag = `<span class="badge badge-danger w-25 mb-3">Urgente</span>`;
    } else if (task.prioridad === 4) {
      tag = `<span class="badge badge-warning w-25 mb-3">Alta</span>`;
    } else if (task.prioridad === 3) {
      tag = `<span class="badge badge-warning w-25 mb-3">Media</span>`;
    } else if (task.prioridad === 2) {
      tag = `<span class="badge badge-info w-25 mb-3">Baja</span>`;
    } else if (task.prioridad === 1) {
      tag = `<span class="badge badge-success w-25 mb-3">Muy Baja</span>`;
    }
    return tag
  }

  evaluarTask (task) {
    const now = new Date()
    let alerta = ''
    if (now.getTime() === new Date(task.fecha).getTime()) {
      alerta = `<div class="alert alert-warning" role="alert">
        Tarea Por Vencerse
        </div>
      `
    } else if (new Date(task.fecha).getTime() < now.getTime()) {
      alerta = `<div class="alert alert-danger" role="alert">
        Esta tarea esta por vencer
        </div>
      `
    } else {
      alerta = `<div class="alert alert-success" role="alert">
        Aun Tienes tiempo para completarla
        </div>
      `
    }
    return alerta
  }


  validateTask () {
    if (!this.nombreTarea || this.nombreTarea === "") {
      return {
        error: true,
        message: 'Nombre Requerido'
      }
    } else if (!this.prioridadTarea || this.prioridadTarea === "") {
      return {
        error: true,
        message: 'Prioridad Requerida'
      }
    } else if (!this.fechaTarea) {
      return {
        error: true,
        message: 'Fecha Requerida'
      }
    }
    return {
      error: false,
      message: ''
    }
  }

  validateTaskUpdate () {
    if (!this.nombreTareaUpdate || this.nombreTareaUpdate === "") {
      return {
        error: true,
        message: 'Nombre Requerido'
      }
    } else if (!this.prioridadTareaUpdate || this.prioridadTareaUpdate === "") {
      return {
        error: true,
        message: 'Prioridad Requerida'
      }
    } else if (!this.fechaTareaUpdate) {
      return {
        error: true,
        message: 'Fecha Requerida'
      }
    }
    return {
      error: false,
      message: ''
    }
  }

  /**
   * Actualiza una tarea del usuario
   */
  updateTaskAction () {
    const { error, message } = this.validateTaskUpdate()
    if (error) {
      this.updateMessage = message
      this.booleanUpdate = true
      setTimeout(() => {
        this.updateMessage = ''
        this.booleanUpdate = false
      }, 2000);
    } else {
      const updateTaskObject = {
        nombre: this.nombreTareaUpdate,
        prioridad: this.prioridadTareaUpdate,
        fecha: this.fechaTareaUpdate,
        autor: this.autorId,
        completed: this.completedTareaUpdate
      }
      try {
        this.httpClient
          .put(`http://localhost:3000/api/task/${this.idTareaUpdate}`, updateTaskObject)
          .subscribe((responseUpdateTask: any) => {
            if (responseUpdateTask) {
              this.nombreTareaUpdate = ''
              this.prioridadTareaUpdate = ''
              this.fechaTareaUpdate = new Date()
              this.completedTareaUpdate = false
              this.modalUpdateReference.close()
              this.showToastCreatetask = true
              this.toastMessage = responseUpdateTask.message
              this.myTasks()
              setTimeout(() => {
                this.showToastCreatetask = false
                this.toastMessage = ''
              }, 3500);
            }
          }, err => {
            console.log(err)
            this.toastMessageDanger = err.message
            this.showToastDanger = true
            setTimeout(() => {
              this.toastMessageDanger = ''
              this.showToastDanger = false
            }, 1900);
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**
   * Elimina una tarea registrada
   */
  deleteTaskAction () {
    try {
      this.httpClient
        .delete(`http://localhost:3000/api/task/${this.idTaskDelete}`)
        .subscribe((responseDelete: any) => {
          if (responseDelete && responseDelete.data._id) {
            this.modalDeleteReference.close()
            this.modalDeleteReference.result.then((result: any) => {}, (reason: any) => {console.log(reason)});
            this.toastMessage = responseDelete.message
            this.showToastCreatetask = true
            setTimeout(() => {
              this.toastMessage = ''
              this.showToastCreatetask = false
            }, 3000);
            this.myTasks()
          }
        }, (err: any) => {
          console.log(err)
          this.toastMessageDanger = err.message
          this.showToastDanger = true
          setTimeout(() => {
            this.toastMessageDanger = ''
            this.showToastDanger = false
          }, 1900);
        })
    } catch (error) {
      
    }
  }

  /**
   * 
   * @param task a eliminar
   * @param deleteTaskModal modal de eliminación 
   */
  eliminarTask (task, deleteTaskModal) {
    console.log(task)
    this.idTaskDelete = task._id
    this.nombreTaskDelete = task.nombre
    this.modalDeleteReference = this.modalService.open(deleteTaskModal)
  }

  /**
   * Registra una tarea nueva
   */
  registerTask () {
    const { error, message } = this.validateTask()
    if (error) {
      this.createMessage = message
      this.booleanCreate = true
      setTimeout(() => {
        this.createMessage = ''
        this.booleanCreate = false
      }, 2000);
    } else {
      const createTaskObject = {
        nombre: this.nombreTarea,
        prioridad: this.prioridadTarea,
        fecha: this.fechaTarea,
        autor: this.autorId
      }
      try {
        this.httpClient
          .post('http://localhost:3000/api/task/', createTaskObject)
          .subscribe((responseCreateTask: any) => {
            console.log(responseCreateTask)
            if (responseCreateTask) {
              this.modalTaskReference.close()
              this.showToastCreatetask = true
              this.toastMessage = responseCreateTask.message
              this.myTasks()
              setTimeout(() => {
                this.showToastCreatetask = false
                this.toastMessage = ''
              }, 3500);
            }
          }, err => {
            console.log(err)
            this.toastMessageDanger = err.message
            this.showToastDanger = true
            setTimeout(() => {
              this.toastMessageDanger = ''
              this.showToastDanger = false
            }, 1900);
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**
   * Verifica si el usuario se ha logeado antes
   */
  isLogeado () {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    if (!userData || !userData.nombre || !userData.email) {
      this.router.navigate([''])
    } else {
      this.autorId = userData.id
      this.autorNombre = userData.nombre
      this.autorEmail = userData.email
      this.myTasks()
    }
  }

  /**
   * Abre modal de creación de tarea
   */
  crearTarea(createTaskModal) {
    this.modalTaskReference = this.modalService.open(createTaskModal);
    this.modalTaskReference.result.then((result: any) => {}, (reason: any) => {console.log(reason)});
  }

  /**
   * Carga mis tareas registradas
   */
  myTasks () {
    try {
      this.httpClient
      .get(`http://localhost:3000/api/task/${this.autorId}`)
      .subscribe((responseCreateAutor: any) => {
        if (responseCreateAutor) {
          this.tasks = responseCreateAutor.data
        }
      }, err => {
        this.toastMessageDanger = err.message
        this.showToastDanger = true
        setTimeout(() => {
          this.toastMessageDanger = ''
          this.showToastDanger = false
        }, 1900);
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  cerrarSesion () {
    localStorage.removeItem('user_data')
    this.router.navigate([''])
  }

}
