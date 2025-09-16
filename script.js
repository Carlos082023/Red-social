const urlBase = "https://jsonplaceholder.typicode.com/posts";
let posts = [];
let currentPage = 1;
const postsPerPage = 10;

// --- Traer datos de API y combinar con locales ---
function getData() {
  const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
  fetch(urlBase)
    .then((res) => res.json())
    .then((apiPosts) => {
      posts = [...localPosts, ...apiPosts];
      currentPage = 1;
      renderPostList();
      renderPagination();
      toggleEmptyState();
    })
    .catch((error) => console.error("Error al llamar a la API: ", error));
}

// --- Renderizar posts según página ---
function renderPostList() {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";

  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = posts.slice(start, end);

  pagePosts.forEach((post) => {
    const listItem = document.createElement("li");
    listItem.classList.add("postItem");
    listItem.innerHTML = `
          <div class="post-header">
            <div class="post-title">${post.title}</div>
            <div class="post-actions">
              <button onclick="editPost(${post.id})" class="edit-btn"><i class="fa-solid fa-pen"></i></button>
              <button onclick="deletePost(${post.id})" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <div class="post-body">${post.body}</div>
          <div id="editForm${post.id}" class="editForm" style="display:none">
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <textarea id="editBody-${post.id}" rows="3" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})" class="update-btn"><i class="fa-solid fa-check"></i> Actualizar</button>
          </div>
        `;
    postList.appendChild(listItem);
  });

  toggleEmptyState();
}

// --- Renderizar botones de paginación ---
function renderPagination() {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (totalPages > 1) {
    pagination.innerHTML = `
          <button ${
            currentPage === 1 ? "disabled" : ""
          } onclick="changePage(currentPage - 1)">
            <i class="fas fa-chevron-left"></i> Anterior
          </button>
          <span>Página ${currentPage} de ${totalPages}</span>
          <button ${
            currentPage === totalPages ? "disabled" : ""
          } onclick="changePage(currentPage + 1)">
            Siguiente <i class="fas fa-chevron-right"></i>
          </button>
        `;
    pagination.style.display = "flex";
  } else {
    pagination.style.display = "none";
  }
}

// --- Cambiar página ---
function changePage(page) {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderPostList();
  renderPagination();
}

// --- Mostrar/ocultar posts ---
function togglePosts() {
  const postList = document.getElementById("postList");
  const pagination = document.getElementById("pagination");
  const toggleButton = document.getElementById("toggleButton");
  const emptyState = document.getElementById("emptyState");

  const isHidden = postList.style.display === "none";
  postList.style.display = isHidden ? "block" : "none";
  pagination.style.display = isHidden && posts.length > 0 ? "flex" : "none";
  toggleButton.innerHTML = isHidden
    ? '<i class="fas fa-eye-slash"></i> Ocultar Posteos'
    : '<i class="fas fa-eye"></i> Mostrar Posteos';

  toggleEmptyState();
}

// --- Mostrar/ocultar estado vacío ---
function toggleEmptyState() {
  const postList = document.getElementById("postList");
  const emptyState = document.getElementById("emptyState");

  if (postList.style.display !== "none" && posts.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

// --- Agregar nuevo post local ---
function postData() {
  const postTitle = document.getElementById("title").value.trim();
  const postBody = document.getElementById("postBody").value.trim();
  if (!postTitle || !postBody) {
    alert("Los campos son obligatorios");
    return;
  }

  const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const newId =
    localPosts.length > 0
      ? Math.max(...localPosts.map((p) => p.id)) + 1000
      : 1001;
  const newPost = { id: newId, title: postTitle, body: postBody };

  localPosts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(localPosts));
  posts.unshift(newPost);

  currentPage = 1;
  renderPostList();
  renderPagination();
  document.getElementById("postForm").reset();

  // Mostrar los posts si estaban ocultos
  const postList = document.getElementById("postList");
  if (postList.style.display === "none") {
    togglePosts();
  }
}

// --- Editar post local ---
function editPost(id) {
  const editForm = document.getElementById(`editForm${id}`);
  editForm.style.display = editForm.style.display === "none" ? "block" : "none";
}

// --- Actualizar post local ---
function updatePost(id) {
  const editTitle = document.getElementById(`editTitle-${id}`).value.trim();
  const editBody = document.getElementById(`editBody-${id}`).value.trim();

  let localPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const index = localPosts.findIndex((p) => p.id === id);

  if (index !== -1) {
    localPosts[index].title = editTitle;
    localPosts[index].body = editBody;
    localStorage.setItem("posts", JSON.stringify(localPosts));

    const globalIndex = posts.findIndex((p) => p.id === id);
    if (globalIndex !== -1) {
      posts[globalIndex].title = editTitle;
      posts[globalIndex].body = editBody;
    }

    renderPostList();
  } else {
    alert("Solo se pueden editar los posts locales");
  }
}

// --- Eliminar post ---
function deletePost(id) {
  if (!confirm("¿Estás seguro de que quieres eliminar este post?")) {
    return;
  }

  if (id > 100) {
    // post local
    let localPosts = JSON.parse(localStorage.getItem("posts")) || [];
    localPosts = localPosts.filter((p) => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(localPosts));
  }
  posts = posts.filter((p) => p.id !== id);
  renderPostList();
  renderPagination();
  toggleEmptyState();
}
