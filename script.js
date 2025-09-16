const urlBase = "https://jsonplaceholder.typicode.com/posts";
let posts = [];
let currentPage = 1;
const postsPerPage = 10;

// --- Traer datos ---
function getData() {
    let localPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // ✅ Filtrar solo los que realmente son locales
    // Si tienen isLocal o si su id es mayor a 1000 (porque Date.now() da IDs grandes)
    localPosts = localPosts.filter(p => p.isLocal === true || p.id > 1000);

    const localPostsFlagged = localPosts.map((p) => ({ ...p, isLocal: true }));

    fetch(urlBase)
        .then((res) => res.json())
        .then((apiPosts) => {
            const apiPostsFlagged = apiPosts.map((p) => ({ ...p, isLocal: false }));

            // Combinar posts manteniendo locales primero
            posts = [...localPostsFlagged, ...apiPostsFlagged];
            currentPage = 1;
            renderPostList();
            renderPagination();
        })
        .catch((err) => {
            console.error("Error al llamar a la API:", err);
            // En caso de error, mostrar solo posts locales
            posts = localPostsFlagged;
            currentPage = 1;
            renderPostList();
            renderPagination();
        });
}

// --- Renderizar posts ---
function renderPostList() {
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    if (posts.length === 0) {
        document.getElementById("emptyState").style.display = "flex";
        document.getElementById("pagination").style.display = "none";
        return;
    }

    document.getElementById("emptyState").style.display = "none";

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pagePosts = posts.slice(start, end);

    pagePosts.forEach((post) => {
        const li = document.createElement("li");
        li.className = "post-card";
        
        // Añadir clase específica según el tipo de post
        if (post.isLocal) {
            li.classList.add("local-post");
        } else {
            li.classList.add("api-post");
        }

        li.innerHTML = `
            <div class="post-card-header">
                <div class="post-title">${post.title}</div>
                <div class="post-actions">
                    ${post.isLocal ? `
                        <button onclick="editPost(${post.id})" class="edit-btn" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="deletePost(${post.id})" class="delete-btn" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="post-body">${post.body}</div>
            <div class="post-meta">
                <div class="post-source">
                    ${post.isLocal
                        ? '<span class="local-badge">📌 Publicación Local</span>'
                        : '<span class="api-badge">🌐 Desde API</span>'
                    }
                </div>
            </div>
            ${post.isLocal ? `
            <div id="editForm${post.id}" class="edit-form" style="display:none">
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
                <textarea id="editBody-${post.id}" rows="3" required>${post.body}</textarea>
                <button onclick="updatePost(${post.id})" class="update-btn">
                    <i class="fa-solid fa-check"></i> Actualizar
                </button>
            </div>` : ''}
        `;

        postList.appendChild(li);
    });
}

// --- Agregar post local ---
function postData() {
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("postBody").value.trim();
    if (!title || !body) return alert("Campos obligatorios");

    const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
    
    // ✅ ID único para evitar choques con los de la API
    const newId = Date.now();

    const newPost = { id: newId, title, body, isLocal: true };
    localPosts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(localPosts));

    // Actualizar lista de posts
    posts = [newPost, ...posts];
    currentPage = 1;
    renderPostList();
    renderPagination();
    document.getElementById("postForm").reset();
}

// --- Editar / Actualizar ---
function editPost(id) {
    const form = document.getElementById(`editForm${id}`);
    form.style.display = form.style.display === "none" ? "block" : "none";
}

function updatePost(id) {
    const title = document.getElementById(`editTitle-${id}`).value.trim();
    const body = document.getElementById(`editBody-${id}`).value.trim();

    const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const idx = localPosts.findIndex(p => p.id === id);
    if (idx === -1) return alert("Solo posts locales pueden editarse");

    localPosts[idx].title = title;
    localPosts[idx].body = body;
    localStorage.setItem("posts", JSON.stringify(localPosts));

    // Actualizar en la lista de posts mostrada
    const globalIdx = posts.findIndex(p => p.id === id && p.isLocal);
    if (globalIdx !== -1) {
        posts[globalIdx].title = title;
        posts[globalIdx].body = body;
    }

    renderPostList();
}

// --- Eliminar post local ---
function deletePost(id) {
    if (!confirm("¿Seguro quieres eliminar este post?")) return;

    const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const newLocalPosts = localPosts.filter(p => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(newLocalPosts));

    posts = posts.filter(p => !(p.isLocal && p.id === id));
    renderPostList();
    renderPagination();
}

// --- Paginación ---
function renderPagination() {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(posts.length / postsPerPage);

    if (totalPages > 1) {
        pagination.style.display = "flex";
        pagination.innerHTML = `
            <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
            <span>Página ${currentPage} de ${totalPages}</span>
            <button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(currentPage + 1)">
                Siguiente <i class="fas fa-chevron-right"></i>
            </button>
        `;
    } else {
        pagination.style.display = "none";
    }
}

function changePage(page) {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPostList();
    renderPagination();
}

// --- Mostrar / Ocultar posts ---
function togglePosts() {
    const postList = document.getElementById("postList");
    const pagination = document.getElementById("pagination");
    const toggleButton = document.getElementById("toggleButton");
    const emptyState = document.getElementById("emptyState");

    const isHidden = postList.style.display === "none";
    postList.style.display = isHidden ? "grid" : "none";
    
    if (posts.length > 0) {
        pagination.style.display = isHidden ? "flex" : "none";
        emptyState.style.display = "none";
    } else {
        pagination.style.display = "none";
        emptyState.style.display = isHidden ? "flex" : "none";
    }
    
    toggleButton.innerHTML = isHidden
        ? '<i class="fas fa-eye-slash"></i> Ocultar Posteos'
        : '<i class="fas fa-eye"></i> Mostrar Posteos';
}

// Inicializar
document.addEventListener("DOMContentLoaded", function() {
    getData();
});
