const urlBase = "https://jsonplaceholder.typicode.com/posts";
let posts = []; // Iniciamos el array de posteos vacío
let postsLoaded = false; // Variable de control para saber si ya cargamos los posteos

function getData() {
    const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
  if (!postsLoaded) {
    fetch(urlBase)
      .then((res) => res.json())
      .then((data) => {
        posts = [...data, ...localPosts]; 
        renderPostList()
        postsLoaded = true; // Marcar que ya se han cargado los posteos
      })
      .catch((error) => console.error("Error al llamar a la API: ", error));
  }else {
    posts = [...localPosts]; // Si ya cargó la API, usar solo LocalStorage
    renderPostList();
  }
}

function renderPostList() {
  const postList = document.getElementById("postList");
  postList.innerHTML = ""; // Limpiar los posteos anteriores

  posts.forEach((post) => {
    const listItem = document.createElement("li");
    listItem.classList.add("postItem");
    listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">
            <i class="fa-solid fa-pen"></i> Editar
        </button>
        <button onclick="deletePost(${post.id})">
            <i class="fa-solid fa-trash"></i> Eliminar
        </button>
        <div id="editForm${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody">Comentario: </label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">
                <i class="fa-solid fa-check"></i> Actualizar
            </button>
        </div>
    `;
    postList.appendChild(listItem);
})
}

//Funcion de boton para mostrar los posteos y ocultar
function togglePosts() {
  const postList = document.getElementById("postList");
  const toggleButton = document.getElementById("toggleButton");

  // Alternar la visibilidad de los posteos
  const isHidden = postList.style.display === "none";
  postList.style.display = isHidden ? "block" : "none";
  toggleButton.textContent = isHidden ? "Ocultar Posteos" : "Mostrar Posteos";
}

//sin llamar a la Api para poder actualizar nuestros posteos propios generando un Id unico
function postData() {
    const postForm = document.getElementById("postForm");
    const postTitle = document.getElementById("title").value.trim();
    const postBody = document.getElementById("postBody").value.trim();
  
    if (postTitle === "" || postBody === "") {
      alert("Los campos son obligatorios");
      return;
    }
  
    // Obtener los posteos locales
    const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
  
    // Asignar un ID único manualmente
    const newId = localPosts.length > 0 ? Math.max(...localPosts.map(p => p.id)) + 1 : 101;
    
    const newPost = {
      id: newId,
      title: postTitle,
      body: postBody,
      userId: 1,
    };
  
    // Agregar el nuevo post al array de posteos
    localPosts.unshift(newPost);
    posts.unshift(newPost);
  
    // Guardar en localStorage
    localStorage.setItem("posts", JSON.stringify(localPosts));
  
    // Renderizar nuevamente la lista de posteos
    renderPostList();
    
    // Limpiar el formulario
    postForm.reset();
  }
  
  

// function postData() {
//   const postForm = document.getElementById("postForm");
//   const postTitle = document.getElementById("title").value.trim();
//   const postBody = document.getElementById("postBody").value.trim();

//   if (postTitle === "" || postBody === "") {
//     alert("Los campos son obligatorios");
//     return;
//   }

//   fetch(urlBase, {
//     method: "POST",
//     body: JSON.stringify({
//       title: postTitle,
//       body: postBody,
//       userId: 1,
//     }),
//     headers: {
//       "Content-type": "application/json; charset=UTF-8",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       posts.unshift(data);
//       localStorage.setItem("posts", JSON.stringify(posts));
//       renderPostList();

//       // Limpiar el formulario completo
//       postForm.reset();

//       console.log("Post agregado y formulario limpiado");
//     })
//     .catch((error) => console.error("Error al querer agregar posteo", error));
// }

function editPost(id){
    const editForm = document.getElementById(`editForm${id}`)
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

// function updatePost(id) {
//     const editTitle = document.getElementById(`editTitle-${id}`).value;
//     const editBody = document.getElementById(`editBody-${id}`).value;

//     fetch(`${urlBase}/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify({
//             id: id,
//             title: editTitle,
//             body: editBody,
//             userId: 1,
//         }),
//         headers: {
//             'Content-type': 'application/json; charset=UTF-8',
//         },
//     })
//         .then(res => res.json())
//         .then(data => {
//             const index = posts.findIndex(post => post.id === data.id)
//             if (index != -1) {
//                 posts[index] = data
//             } else {
//                 alert('Hubo un error al actualizar la información del posteo')
//             }
//             renderPostList()
//         })
//         .catch(error => console.error('Error al querer actualizar posteo: ', error))
// }


// otro metodo para actualizar nuestros posteos locales ya que no tengo un backend
function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    // Buscar el post en el array local
    const index = posts.findIndex(post => post.id === id);

    if (index !== -1) {
        posts[index].title = editTitle;
        posts[index].body = editBody;

        // Guardar en localStorage
        localStorage.setItem("posts", JSON.stringify(posts));

        renderPostList();
    } else {
        alert('Hubo un error al actualizar el posteo.');
    }
}


function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok){
            posts = posts.filter(post => post.id != id)
            renderPostList();
        } else{
            alert('Hubo un error y no se pudo eliminar el posteo')
        }
    })
    .catch(error => console.error('Hubo un error: ', error))
}