# Red Social Tweetify

Este es un proyecto de una red social simple llamada **Tweetify**, donde los usuarios pueden crear, editar y eliminar publicaciones utilizando una API pública o almacenamiento local.

## 🚀 Características
- 📌 Crear nuevas publicaciones.
- 📝 Editar publicaciones existentes.
- ❌ Eliminar publicaciones.
- 📥 Guardar publicaciones en `localStorage`.
- 📡 Obtener publicaciones desde una API externa.
- 🎭 Alternar la visibilidad de los posteos.

## 🛠️ Tecnologías utilizadas
- HTML
- CSS
- JavaScript (Vanilla JS)
- API `https://jsonplaceholder.typicode.com/posts`
- `localStorage` para almacenamiento local.

## 📦 Instalación y uso
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/red-social-pajario.git
   ```
2. **Navega al directorio del proyecto:**
   ```bash
   cd red-social
   ```
3. **Abre el archivo `index.html` en tu navegador:**
   - Doble clic en `index.html`, o
   - Usa un servidor local como `Live Server` en VS Code.

## 📜 Estructura del proyecto
```
📁 red-social-pajario
│── 📄 index.html     # Interfaz principal
│── 📄 style.css      # Estilos CSS
│── 📄 script.js      # Lógica del proyecto
│── 📄 README.md      # Documentación
```

## 📖 Funcionamiento
### 1️⃣ **Crear un posteo**
1. Ingresa un título y comentario en el formulario.
2. Presiona **Enviar**.
3. Se guardará en `localStorage` y aparecerá en la lista.

### 2️⃣ **Mostrar / Ocultar posteos**
1. Presiona el botón **Mostrar Posteos**.
2. Se cargarán los posteos desde la API o desde `localStorage`.
3. Presiona **Ocultar Posteos** para esconderlos.

### 3️⃣ **Editar un posteo**
1. Presiona el botón ✏️ **Editar** en un post.
2. Modifica el título o comentario.
3. Presiona ✅ **Actualizar** para guardar los cambios.

### 4️⃣ **Eliminar un posteo**
1. Presiona el botón 🗑️ **Eliminar**.
2. El post desaparecerá de la lista y de `localStorage`.

## 📌 Mejoras futuras
✅ Manejo de usuarios y autenticación.  
✅ Agregar comentarios y reacciones a los posteos.  
✅ Implementar un backend con Node.js y MongoDB.  



