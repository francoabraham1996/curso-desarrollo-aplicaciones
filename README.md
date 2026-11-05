# TaskFlow

Aplicación móvil desarrollada con React Native y Expo como proyecto del curso de Desarrollo de Aplicaciones.

## Checkpoint 1 - Estructura Base

Se creó la estructura inicial del proyecto utilizando Expo y React Native.

## Checkpoint 2 - Pantallas iniciales y ProfileCard

En este checkpoint se incorporaron:

- HomeScreen.
- ProfileScreen.
- Componente reutilizable ProfileCard.
- Uso de props para mostrar nombre, rol e imagen.
- Uso de Image de React Native.
- Estilos mediante StyleSheet.
- Colores centralizados en src/constants/colors.js.
- Soporte para ejecución en Android y Web.

## Estructura

src/
- assets/
- components/
  - Count.js
  - ProfileCard.js
- constants/
  - colors.js
- screens/
  - HomeScreen.js
  - ProfileScreen.js

## Ejecutar el proyecto

Instalar dependencias:

```bash
npm install


# TaskFlow

Aplicación de tareas desarrollada con React Native y Expo.

## Funcionalidades

- Crear tareas con título, descripción y categoría.
- Ver la lista de tareas.
- Ver el detalle de cada tarea.
- Navegar entre Tareas y Perfil.
- Volver a la lista después de guardar una tarea.

## Navegación

Utilicé React Navigation con dos navegadores:

- Bottom Tabs: para cambiar entre Tareas y Perfil.
- Native Stack: para navegar entre la lista, el formulario y el detalle.

## Tecnologías

- React Native
- Expo
- React Navigation
- useState
- FlatList

## Ejecutar el proyecto

npm install

npx expo start

## Módulo 6 - Redux Toolkit

En este módulo agregué Redux Toolkit para manejar las tareas.

### Funcionalidades
- Crear tareas.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas.
- Filtrar por todas, pendientes o completadas.
- Mantener las tareas y filtros al cambiar de pantalla.

### Redux
- store.js: configura el estado global.
- taskSlice.js: contiene las tareas y sus acciones.
- useSelector: permite obtener las tareas.
- useDispatch: permite agregar, completar y eliminar tareas.

### Librerías utilizadas
- @reduxjs/toolkit
- react-redux

## Módulo 7 - Firebase

- Registro e inicio de sesión con Firebase Authentication.
- Sesión de usuario.
- Tareas guardadas en Firestore.
- Crear, completar y eliminar tareas.
- Tareas separadas por usuario.
- Redux Toolkit para mostrar las tareas.

Probé el registro, inicio de sesión y guardado
de tareas desde Expo Go.