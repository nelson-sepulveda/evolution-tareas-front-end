# Evolution Tareas

Este proyecto fue hecho con [Angular CLI](https://github.com/angular/angular-cli) version 11.0.3.


**Interfaz de Login**

![alt text](https://github.com/nelson-sepulveda/evolution-tareas-front-end/blob/master/login.jpg?raw=true)

**Interfaz de Perfil**

![alt text](https://github.com/nelson-sepulveda/evolution-tareas-front-end/blob/master/profile.jpg?raw=true)
## Development server

Ejectue `npm install` para cargar las dependencias

Ejecute `ng serve --open` para cargar el front-end. En la ruta `http://localhost:4200/` la aplicación cargara de manera automatica


## Build

Ejecute `ng build` para generar el proyecto para producción. El proyecto generara una carpeta `dist`

## Explicación

Aquí se encuentra el repositorio del Back-end [Back-end](https://github.com/nelson-sepulveda/evolution-tareas-back-end)

El back-end esta desarrollado en NodeJS utilizando como base de datos MongoDB

Para la ejecución del Back-end se debe ejecutar el comando `node app.js`

La base de datos se utilizan dos modelos los cuales son autor y task donde se encuentran relacionados como en el siguiente modelo

![alt text](https://github.com/nelson-sepulveda/evolution-tareas-front-end/blob/master/modelo.jpg?raw=true)

Para el consumo de los servicios del back-end se utilizo el HttpService de Angular



