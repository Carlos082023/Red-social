const urlBase = "https://jsonplaceholder.typicode.com/posts";
let posts = []; // Iniciamos el array de posteos vacío
let postsLoaded = false; // Variable de control para saber si ya cargamos los posteos

function getData() {
  if (!postsLoaded) {
    fetch(urlBase)
      .then((res) => res.json())
      .then((data) => {
        const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
        posts = [...data, ...localPosts]; // Solo traemos 10 de la API
        renderPostList();
        postsLoaded = true; // Marcar que ya se han cargado los posteos
      })
      .catch((error) => console.error("Error al llamar a la API: ", error));
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
  if (postList.style.display === "none") {
    postList.style.display = "block";
    toggleButton.textContent = "Ocultar Posteos";
  } else {
    postList.style.display = "none";
    toggleButton.textContent = "Mostrar Posteos";
  }
}


function postData() {
  const postForm = document.getElementById("postForm");
  const postTitle = document.getElementById("title").value.trim();
  const postBody = document.getElementById("postBody").value.trim();

  if (postTitle === "" || postBody === "") {
    alert("Los campos son obligatorios");
    return;
  }

  fetch(urlBase, {
    method: "POST",
    body: JSON.stringify({
      title: postTitle,
      body: postBody,
      userId: 1,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      posts.push(data);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderPostList();

      // Limpiar el formulario completo
      postForm.reset();

      console.log("Post agregado y formulario limpiado");
    })
    .catch((error) => console.error("Error al querer agregar posteo", error));
}
