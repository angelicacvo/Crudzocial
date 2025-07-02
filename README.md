# Crudzocial-Coffee -- CookiEaters

-Angelica Cuervo
-Juan Andres Vallejo
-Jeims Velez
-Miguel Ángel Lopera
-Jhon Arias
-Diego Zuluaga

Descripción del sistema

Crudzocial es una red social básica desarrollada como ejercicio académico para simular un entrono de interaccion social mediante de publicaciones e imagenes, o de uso más personal sirviendo para tomar notas. Todo esto con la finalidad de poder aplicar, mejorar y comprender los temas tratados en clases.

El sistema permite registrar usuarios, iniciar sesión, acceder a funcionalidades personalizadas según el tipo de usuario (usuario o administrador) y almacenar información de manera persistente utilizando localStorage y sessionStorage.

-Tecnologías utilizadas

- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES6
- localStorage y sessionStorage para almacenamiento persistente
  Cómo ejecutar y probar el sistema
- json server

1. **Clonar el repositorio o descargar el ZIP.**
2. **Descomprimir y abrir el archivo `index.html` en cualquier navegador.**
3. **Registrar un nuevo usuario o iniciar sesión con uno existente.**
4. **Explorar las funcionalidades desde la vista del usuario y del administrador.**

## Funcionalidades implementadas

- Registro de usuarios con validación
- Inicio de sesión con control de acceso
- Panel de usuario con:
  - Galería de imágenes
  - Notas personales
  - Perfil editable
- Panel de administrador con:
  - Visualización y control de usuarios
  - Visualización de logs de actividad
- Sistema de logs que registra acciones importantes
- Botón de cerrar sesión que borra la sesión activa
- Diseño responsive con Bootstrap

## Explicación técnica

### Uso de `localStorage` y `sessionStorage`

- **localStorage**: Almacena de forma persistente los usuarios registrados, sus notas, imágenes y logs.
- **sessionStorage**: Guarda la sesión activa del usuario para permitir navegación mientras esté logueado.

### Funciones utilizadas

- Funciones para CRUD de usuarios, imágenes y notas.
- Funciones de validación de formularios.
- Funciones para renderizar dinámicamente el contenido según el tipo de usuario.

### Permisos adicionales para el administrador

- Al iniciar sesión como admin (por ejemplo, con un usuario preconfigurado), se accede a vistas exclusivas de administración.
- El admin puede ver todos los usuarios y sus logs.

### Logs

- Se genera un log cada vez que un usuario inicia sesión, registra una nota o interactúa con secciones importantes.
- Estos logs se almacenan en `localStorage` y pueden ser revisados por el administrador.

## ¿Qué aprendimos como equipo?

- Organización de un proyecto web completo con múltiples vistas.
- Manejo de almacenamiento en el navegador (`localStorage` vs `sessionStorage`).
- Aplicación de roles y permisos para usuarios.
- Modularización y reutilización de funciones.
- Trabajo colaborativo y control de versiones en GitHub.

## Estado actual del proyecto

Funcionalidades básicas implementadas  
 Panel de administración operativo  
 Logs y persistencia de datos funcionando  
 No incluye backend ni cifrado de contraseñas  
 En proceso de mejoras visuales y refactorización del código

## Recomendaciones

- Usar el navegador **Google Chrome** para mejor compatibilidad.
- No eliminar manualmente los datos del `localStorage` desde la consola para no perder registros.
