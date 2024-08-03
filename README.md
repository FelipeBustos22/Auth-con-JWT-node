# Autenticación de Usuario en Node.js

Este proyecto implementa la autenticación de usuario en un servidor Express utilizando Node.js. A continuación se detallan las tecnologías y bibliotecas utilizadas:

## Tecnologías Utilizadas

- **Express**: Framework de Node.js para construir el servidor.
- **JWT (JSON Web Tokens)**: Para el manejo de sesiones.
- **db-local**: Base de datos local utilizada para almacenar los datos de los usuarios.
- **bcrypt**: Para la encriptación de contraseñas.
- **EJS**: Motor de plantillas utilizado para una rápida prueba de la interfaz.
- **cookie-parser**: Para almacenar el JWT en cookies en lugar de usar localStorage.

## Descripción del Proyecto

Este proyecto demuestra cómo se puede implementar la autenticación de usuario en una aplicación Node.js utilizando un servidor Express. La autenticación se maneja mediante JSON Web Tokens (JWT) y las contraseñas se encriptan utilizando bcrypt. La información de la sesión se almacena en cookies gracias a cookie-parser, en lugar de utilizar localStorage por razones de seguridad.

## Clonación del Repositorio

Para clonar este repositorio, utiliza el siguiente comando:

```bash
git clone https://github.com/FelipeBustos22/Auth-con-JWT-node.git


