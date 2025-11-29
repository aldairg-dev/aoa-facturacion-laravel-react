# Sistema de Facturación: Laravel 10 & React 18

Este proyecto es el resultado de la **Prueba Técnica de AOA**, desarrollando un sistema de facturación completo con arquitectura cliente-servidor, que permite la gestión integral de clientes, productos y documentos de facturación.

| Componente        | Estado                                                                                                                   |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **Backend**       | ![Laravel 10](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)              |
| **Frontend**      | ![React 18](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)                    |
| **Estilos**       | ![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| **Base de Datos** | ![MySQL 8](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)                     |

---

## 3. Instalación y Configuración

### Requisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- **PHP:** 8.1 o superior
- **Node.js:** 18 o superior
- **Composer**
- **MySQL Server:** 8.0 o superior

### Backend (Laravel)

1.  **Clonar el repositorio y entrar al backend:**

    ```bash
    git clone [https://github.com/aldairg-dev/aoa-facturacion-laravel-react.git](https://github.com/aldairg-dev/aoa-facturacion-laravel-react.git)
    cd aoa-facturacion-laravel-react/backend
    ```

2.  **Instalar dependencias y configurar:**

    ```bash
    composer install
    cp .env.example .env
    php artisan key:generate
    ```

3.  **Configurar la Base de Datos:**
    Modifica el archivo **`.env`** con tus credenciales de MySQL:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=aoa_facturacion # Nombre de tu base de datos
    DB_USERNAME=root
    DB_PASSWORD=
    ```

4.  **Ejecutar Migraciones y Seeds:**

    ```bash
    php artisan migrate
    ```

    ```bash
    php artisan migrate:fresh --seed
    # Para cargar la base de datos con información de los seeder

    ```

5.  **Iniciar el Servidor de Laravel:**

    ```bash
    php artisan serve
    # Backend disponible en: [http://127.0.0.1:8000](http://127.0.0.1:8000)
    ```

### Frontend (React)

1.  **Navegar al directorio frontend:**

    ```bash
    cd ../frontend
    ```

2.  **Instalar dependencias de Node:**

    ```bash
    npm install
    ```

3.  **Iniciar el Cliente de React:**

    ```bash
    npm run dev
    # Frontend disponible en: http://localhost:5173
    ```

## 4. Ejecución Completa

Para acceder a la aplicación, asegúrate de que ambos servidores estén corriendo:

1.  Ejecutar el backend: `cd backend && php artisan serve`
2.  Ejecutar el frontend: `cd frontend && npm run dev`
3.  Abrir el navegador y acceder a: **`http://localhost:5173`**

## 5. Tecnologías Utilizadas

| Categoría         | Tecnología           | Propósito                             |
| :---------------- | :------------------- | :------------------------------------ |
| **Backend**       | **Laravel 10+**      | API RESTful y lógica de negocio.      |
| **Base de Datos** | **MySQL 8+**         | Almacenamiento de datos relacionales. |
| **Frontend**      | **React 18**         | Interfaz de usuario dinámica y SPA.   |
| **Estilos**       | **TailwindCSS 4**    | Framework CSS utility-first.          |
| **HTTP Cliente**  | **Axios**            | Consumo de la API RESTful.            |
| **Routing**       | **React Router DOM** | Manejo de navegación en la SPA.       |
| **Exportación**   | **html2pdf.js**      | Generación de documentos PDF.         |
