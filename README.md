<h1> 2° PARCIAL PP - LA SCALONETA 2022 </h1>

***
<h3 id="indice">Índice</h3>
1) <a href="#objetivo">Objetivo</a> <br>
2) <a href="#requerimientosExcluyentes">Requerimientos excluyentes</a> <br>
3) <a href="#requerimientosPorFecha">Requerimientos por fecha</a> <br>
4) <a href="#profesores">Profesores</a> <br>
5) <a href="#integrantes">Integrantes</a> <br>
6) <a href="#fechasActualizacionesEspecificas">Bitácora tareas específicas</a> <br>
7) <a href="#fechasActualizacionesGenerales">Bitácora tareas generales</a> <br>
7) <a href="#visualizacionProyecto">Visualización del proyecto</a> <br>

***
<h3 id="integrantes">Integrantes</h3>
<a href="https://github.com/ex0num">Gabriel Lopez Gasal</a> - <strong>Alpha</strong> <br>
<a href="https://github.com/valentinlaplume">Valentín Laplume</a> - <strong>Beta</strong> <br>
<a href="https://github.com/aletexis">Alejandra Escubilla</a> - <strong>Gamma</strong> <br>

***
<h3 id="fechasActualizacionesEspecificas">Fechas de actualización / Bitácora de cambios específica</h3>
<strong> 26/10/22 </strong> <br>
<label>- Se dió a la luz al repositorio. - Alpha</label> <br>
<label>- Se inicia la documentación de toda acción realizada en el proyecto.- Alpha</label> <br>
<br>
<strong> 27/10/22 </strong> <br>
<label>- Se pensó y diseñó un nombre, ícono y splash para la aplicación. "Ribato" - "Come, rico y barato". - Alpha</label><br>
<label>- Se creó el template del proyecto. - Alpha</label><br>
<br>
<strong> 07/11/22 </strong> <br>
<label>- Se diseñó un ícono para la aplicación. - Alpha</label><br>
<label>- Se diseñaron las animaciones de la splashscreeen. - Alpha</label><br>
<label>- Se estructuró el proyecto en su totalidad (Modularización de homes/altas) para su buena optimización y carga. - Alpha</label><br>
<label>- Se crearon y desarrollaron los servicios necesarios (QR, Auth, Firestorage, Sending-Mail). - Alpha<br>
<label>- Se creó y diseñó el <strong>Alta de cliente</strong> (tanto anónimo como normal). - Alpha</label><br>
<label>- Se creó y diseñó el <strong>Home de cliente</strong> (tanto anónimo como normal). - Alpha</label><br>
<label>- Se implementaron sonidos (activación y desactivación) y mensajes de error/satisfacción. - Alpha</label><br>
<label>- Se implementaron animaciones adicionales a botones e inputs. - Alpha</label><br>
<label>- Se estructuró el <strong>Todos los homes</strong> - Alpha</label> <br>
<label>- Se muestra el home correspondiente al usuario logeado - Alpha</label> <br>

***
<h3 id="fechasActualizacionesGenerales">Fechas de actualización / Bitácora de cambios general</h3>

<strong> 26/10/22 </strong> <br>
<label>- Se creó el proyecto. - Alpha</label> <br>
<br>
<strong> 27/10/22 </strong> <br>
<label>- Se diseñó el ícono - Alpha</label> <br>
<br>
<strong> 07/11/22 </strong> <br>
<label>- Se diseñó el splash estático y animado. - Alpha</label> <br>
<label>- Se diseñaron las animaciones de la splashscreeen. - Alpha</label> <br>
<label>- Se creó y diseñó el <strong>Alta de cliente (Anónimo y normal)</strong> - Alpha</label> <br>

***
<h3 id="visualizacionProyecto">Visualización del proyecto</h3><br>

<label> Nuestro restaurante, es de tipo urbano/juvenil, nocturno, con un "look and feel" moderno y alejado de la elegancia.</label><br>
<img src="src/assets/icon/Ribato.png" width="300px" height="300px">
<br>
<strong> Pantalla de LOGIN. y de selección de registro </strong><br>
<img src="src/assets/readme-files/menu-login.PNG" width="360px" height="740px">
<img src="src/assets/readme-files/menu-registro.PNG" width="360px" height="740px"><br>

<strong> Pantalla de ALTA CLIENTE (anónimo y normal).</strong><br>
<img src="src/assets/readme-files/alta-cliente.PNG" width="360px" height="740px">
<img src="src/assets/readme-files/alta-anonimo.PNG" width="360px" height="740px"><br>

<!-- <img src="src/assets/readme-files/menu-login.gif" width="50%" height="450px">
<img src="src/assets/readme-files/registro-usuario-normal.gif" width="50%" height="450px">
<br>
<img src="src/assets/readme-files/splash-animado.gif" width="50%" height="450px">
<img src="src/assets/readme-files/splash-estatico.jpg" width="50%" height="450px"> -->

***
<h3 id="comandos">Comandos utilizados</h3>

Actualizar la carpeta android con los archivos de Angular
```
$ ng build
$ ionic capacitor add android
$ cordova-res android --skip-config --copy
```

Agregar la carpeta android (Generada desde 0)
```
$ npx cap add android
```

Levantar un servidor local del proyecto
```
$ ionic serve
```
 
Crear el proyecto
```
$ ionic start Ribato blank --type=angular
$ cd Ribato
$ npm install @capacitor/core
$ npm install @capacitor/cli --save-dev
$ npm install @capacitor/android
$ npx cap init
```
 
***
<h3 id="profesores">Profesores</h3>

<a href="https://github.com/agmorelli">Augusto Morelli</a> - <strong>Ayudante</strong> <br>
<a href="https://github.com/naferrero-utnfra">Nicolás Ferrero</a> - <strong>Ayudante</strong> <br>
<a href="https://github.com/maxineinerutn">Maximiliano Neiner</a> - <strong>Profesor</strong> <br>
  
***
<h3 id="objetivo">Objetivo</h3>
Lograr una aplicación utilizando el hardware del dispositivo móvil para la gestión de información, enfocada en la experiencia de usuario. <br>
El enfoque va a estar dado por los usuarios de un RESTAURANT, el cual apunta todos sus esfuerzos en mejorar la utilización de su servicio por medio de una aplicación para celulares. <br>

***
<h3 id="requerimientosExcluyentes">Requerimientos excluyentes</h3>

- Splash animado con ícono de la aplicación y los apellidos y nombres de los integrantes del grupo. <br>
- Todo en español. (¡TODO EN ESPAÑOL, los acentos pertenecen al idioma!). <br>
- Todo error o información mostrarlo con distintas ventanas. (DISTINTAS, ¡NO alerts!). <br>
- Sonidos distintos al iniciar y cerrar la aplicación. <br>
- Validación de datos, en todos los formularios. (TODOS LOS DATOS, EN TODOS LOS FORMULARIOS). <br>
- Spinners, con el logo de la empresa, en todas las esperas. (TODAS). <br>
- Vibraciones al detectarse un error. (TODOS LOS ERRORES). <br>
- Distintos botones de usuario para testear el ingreso (flotantes, fijos, con distintas formas y distintas posiciones). <br>
- La TOTALIDAD de la superficie de la pantalla debe estar ocupada con distintos elementos. (¡NO debe haber espacios neutros!). <br>
- Generación de distintos tipos de encuestas. <br>
- Utilización de push notification. <br>
- Envío automático de correos electrónicos (desde cuenta 'empresarial', NO desde la cuenta de un particular). <br>
- Lectura de distintos códigos Qr’s. <br>
- Implementación de distintos juegos. <br>
- Generación de documentos (JSON / EXCEL). <br>
- Cargado de datos por medio de un archivo (JSON / EXCEL). <br>
- Gráficos estadísticos (torta, barra, etc.). <br>
- Los perfiles de usuarios deben ser: <br>
   + Dueño <br>
   + Supervisor <br>
   + Empleado (tipos: metre, mozo, cocinero, bartender) <br>
   + Cliente (tipos: registrado o anónimo) <br>

***
<h3 id="requerimientosPorFecha">Requerimientos por fechas de entrega</h3>

<strong>
  Requerimientos 1era fecha (segundo parcial):
</strong> 

<br>

- Datos cargados de tres (3) semanas de operaciones (simuladas). <br>
- Todas las altas completas por integrante. <br>
- Todos los Qr completos por integrante. <br>
- Al menos siete (7) responsabilidades completas por alumno (incluyendo las tareas de gestión a definir). <br>
- Icono de la empresa.
- Splash con animación (detallando apellidos y nombres de los integrantes del grupo). <br>
- Sonidos, con posibilidad de desactivarlos desde la aplicación. <br>
- Despacho automático de correos electrónicos. <br>
- Push notification. <br>

<strong>
  Requerimientos 2da fecha (primera fecha de finales):
</strong>

<br>

- Al menos nueve (9) responsabilidades completas por alumno (incluyendo todas las tareas de gestión). <br>
- Todas las encuestas realizadas. <br>
- Login con redes sociales (Facebook, Google+, etc.). <br>

<strong>
  Requerimientos 3era fecha o posterior
</strong>

<br>

- A definir. <br>
