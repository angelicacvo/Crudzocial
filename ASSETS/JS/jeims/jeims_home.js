const USERS_URL = "http://localhost:3000/users";
const IMAGES_URL = "http://localhost:3000/images";
const NOTES_URL = "http://localhost:3000/notes";
const POSTS_URL = "http://localhost:3000/posts";

let editingPostId = null;
let loggedUser = null;
let editingImageId = null;
let editingNoteId = null;

/* -------------------------------------------------------------------------- */
/* GUARDIAN */
/* -------------------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", async () => {
loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser?.email || !loggedUser?.name) return redirectToLogin();

try {
const res = await fetch(USERS_URL);
const users = await res.json();

const userExists = users.find(
    (u) => u.email === loggedUser.email && u.name === loggedUser.name
);
if (!userExists) return redirectToLogin();

// Mostrar nombre en perfil
const profileNameEl = document.querySelectorAll(".profile__name a")[0];
if (profileNameEl) profileNameEl.textContent = loggedUser.name;

// Logout
document.querySelectorAll(".profile__name a")[1]?.addEventListener("click", async () => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
        await logAction("Cierre de sesión"); // Esperar a que se registre
        localStorage.removeItem("loggedUser");
        window.location.href = "/PAGES/index.html";
    }
});


// GALERIA DE IMAGENES
loadUserImages(loggedUser.email);
document.getElementById("addImageBtn").addEventListener("click", () => {
    document.getElementById("imageFormContainer").style.display = "block";
});
document.getElementById("cancelForm").addEventListener("click", resetForm);
document.getElementById("imageForm").addEventListener("submit", handleImageSubmit);

// NOTAS
loadUserNotes(loggedUser.email);

loadAllPosts();

const publishBtn = document.querySelector(".publish_btn");
const textarea = document.getElementById("exampleFormControlTextarea1");

publishBtn.addEventListener("click", async () => {
    const noteText = textarea.value.trim();
    if (!noteText) return alert("Escribe algo primero");

    const newNote = {
    userEmail: loggedUser.email,
    text: noteText,
    timestamp: new Date().toISOString(),
    };

if (editingNoteId) {
await fetch(`${NOTES_URL}/${editingNoteId}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ ...newNote, id: editingNoteId }),
});

updateNoteInDOM({ ...newNote, id: editingNoteId });
logAction("Editó una nota"); 
editingNoteId = null;
} else {
const res = await fetch(NOTES_URL, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(newNote),
});

const saved = await res.json();
renderNote(saved);
logAction("Creó una nota"); 
}

    textarea.value = "";
});
} catch (err) {
console.error("Error cargando usuario:", err);
redirectToLogin();
}
});

/* -------------------------------------------------------------------------- */
/* GALERIA DE IMAGENES */
/* -------------------------------------------------------------------------- */
async function handleImageSubmit(e) {
e.preventDefault();

const fileInput = document.getElementById("imageFile");
const textInput = document.getElementById("imageText");
const file = fileInput.files[0];
const text = textInput.value.trim();

if (!file || !text) return alert("Falta la imagen o el texto");

const reader = new FileReader();
reader.onload = async () => {
const base64Image = reader.result;
const newImage = {
    userEmail: loggedUser.email,
    text,
    image: base64Image,
    timestamp: new Date().toISOString(),
};

if (editingImageId) {
await fetch(`${IMAGES_URL}/${editingImageId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newImage, id: editingImageId }),
});
updateCardInDOM({ ...newImage, id: editingImageId });
logAction("Editó una imagen"); 
editingImageId = null;
} else {
const res = await fetch(IMAGES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newImage),
});
const saved = await res.json();
renderCard(saved);
logAction("Subió una imagen"); 
}

resetForm();
};

reader.readAsDataURL(file);
}

async function loadUserImages(email) {
const res = await fetch(IMAGES_URL);
const images = await res.json();
const userImages = images.filter((img) => img.userEmail === email);
userImages.forEach(renderCard);
}

function renderCard({ id, image, text }) {
const cardContainer = document.getElementById("galleryCards");

const shortened = text.length > 120 ? text.slice(0, 120) + "..." : text;

const card = document.createElement("div");
card.className = "gallery-card";
card.dataset.id = id;

card.innerHTML = `
<img src="${image}" alt="Imagen subida" class="gallery-card__img" />
<div class="gallery-card__body">
    <p class="gallery-card__text">${shortened}</p>
    <small class="gallery-card__date">Agregado</small>
    <div class="gallery-card__buttons">
    <button class="btn btn-primary btn-sm" onclick="editImage('${id}')">Editar</button>
    <button class="btn btn-danger btn-sm" onclick="deleteImage('${id}', this)">Eliminar</button>
    </div>
</div>
`;

cardContainer.appendChild(card);
}


async function editImage(id) {
const res = await fetch(`${IMAGES_URL}/${id}`);
const imgData = await res.json();

document.getElementById("imageText").value = imgData.text;
document.getElementById("imageFormContainer").style.display = "block";
editingImageId = id;
}

async function deleteImage(id, btn) {
if (!confirm("¿Eliminar esta imagen?")) return;

await fetch(`${IMAGES_URL}/${id}`, { method: "DELETE" });
btn.closest(".gallery-card").remove();
logAction("Eliminó una imagen"); 

}

function updateCardInDOM({ id, image, text }) {
const card = document.querySelector(`[data-id="${id}"]`);
if (card) {
card.querySelector("img").src = image;
card.querySelector(".gallery-card__text").textContent = text;
}
}

function resetForm() {
document.getElementById("imageForm").reset();
document.getElementById("imageFormContainer").style.display = "none";
editingImageId = null;
}

/* -------------------------------------------------------------------------- */
/* NOTAS */
/* -------------------------------------------------------------------------- */
async function loadUserNotes(email) {
    const res = await fetch(NOTES_URL);
    const notes = await res.json();
    const userNotes = notes.filter((n) => n.userEmail === email);
    userNotes.forEach(renderNote);
}

function renderNote({ id, text }) {
const container = document.getElementById("notesContainer");

const noteDiv = document.createElement("div");
noteDiv.className = "custom-note";
noteDiv.dataset.id = id;

const textSpan = document.createElement("span");
textSpan.className = "custom-note__text";
textSpan.textContent = text;
textSpan.addEventListener("click", () => {
    document.getElementById("exampleFormControlTextarea1").value = text;
    editingNoteId = id;
});

const deleteBtn = document.createElement("button");
deleteBtn.className = "custom-note__delete";
deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta nota?")) return;
    await fetch(`${NOTES_URL}/${id}`, { method: "DELETE" });
    noteDiv.remove();
    logAction("Eliminó una nota"); 
});

noteDiv.appendChild(textSpan);
noteDiv.appendChild(deleteBtn);
container.prepend(noteDiv);
}

function updateNoteInDOM({ id, text }) {
const note = document.querySelector(`.custom-note[data-id="${id}"]`);
if (note) note.querySelector(".custom-note__text").textContent = text;
}

/* -------------------------------------------------------------------------- */
/* PUBLICACIONES */
/* -------------------------------------------------------------------------- */

// Cargar todas las publicaciones y mostrar botón para crear
async function loadAllPosts() {
    const res = await fetch(POSTS_URL);
    const posts = await res.json();
    posts.forEach(renderPost);
    renderAddPostButton(); //Botón único arriba
    }

    /* Renderizar una publicación */
    function renderPost({ id, userEmail, text, timestamp }) {
    const container = document.getElementById("postsContainer");

    const isOwner = loggedUser?.email === userEmail;
    const isAdmin = loggedUser?.email === "4dm1n00001@gmail.com";
    const fecha = new Date(timestamp).toLocaleString();

    const card = document.createElement("div");
    card.className = "card note__card";
    card.dataset.id = id;

    card.innerHTML = `
    <div class="card-header note__card__header">
        <div class="card_title">Post</div>
    ${(isOwner || isAdmin) ? `
    <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        <i class="fa-regular fa-pen-to-square"></i>
    </button>
    <ul class="dropdown-menu">
        ${(isOwner || isAdmin) ? `<li><a class="dropdown-item" href="#" onclick="editPost('${id}')">Editar</a></li>` : ""}
        <li><a class="dropdown-item" href="#" onclick="deletePost('${id}')">Eliminar</a></li>
    </ul>
    </div>
    ` : ""}
    </div>
    <div class="card-body">
        <figure>
        <blockquote class="blockquote">
            <p class="post__text">${text}</p>
        </blockquote>
        <figcaption class="blockquote-footer">
            ${userEmail} en <cite>${fecha}</cite>
        </figcaption>
        </figure>
    </div>
    `;

    container.prepend(card);
    }

    /* Crear formulario para nueva publicación */
function renderAddPostButton() {
    const existingBtn = document.getElementById("addPostBtn");
    if (existingBtn) return;

    const wrapper = document.getElementById("addPostBtnWrapper");
    wrapper.innerHTML = `
        <div style="margin: 1rem 0;">
        <button id="addPostBtn" onclick="createPostFormUI()" style="
            background-color: var(--claret);
            color: var(--principal--text);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        ">➕ Agregar publicación</button>
        </div>
    `;

    // Estilo hover
    const btn = document.getElementById("addPostBtn");
    btn.addEventListener("mouseover", () => {
        btn.style.backgroundColor = "var(--claret--hover)";
    });
    btn.addEventListener("mouseout", () => {
        btn.style.backgroundColor = "var(--claret)";
    });
    }


    /* Crear o editar publicación */
    function createPostFormUI() {
    const postsContainer = document.getElementById("postsContainer");

    // Evita duplicar el formulario
    if (document.getElementById("postFormWrapper")) return;

    const formWrapper = document.createElement("div");
    formWrapper.id = "postFormWrapper";
    formWrapper.style.margin = "1rem 0";

    formWrapper.innerHTML = `
        <div class="card note__card">
        <div class="card-header note__card__header">
            <div class="card_title">Nueva publicación</div>
        </div>
        <div class="card-body">
            <textarea class="form-control mb-2" id="postTextarea" rows="2" placeholder="Escribe tu publicación..."></textarea>
            <div style="display: flex; gap: 0.5rem;">
            <button class="publish_post_btn" style="
                background-color: var(--claret);
                color: var(--principal--text);
                border: none;
                padding: 0.4rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            ">Publicar</button>

            <button class="cancel_post_btn" style="
                background-color: transparent;
                color: var(--text-color);
                border: 1px solid var(--claret);
                padding: 0.4rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            ">Cancelar</button>
            </div>
        </div>
        </div>
    `;

    postsContainer.prepend(formWrapper);

    document.querySelector(".publish_post_btn").addEventListener("click", async () => {
        const textarea = document.getElementById("postTextarea");
        const text = textarea.value.trim();

        if (!text) return alert("Escribe algo para publicar");

    const originalEmail = document.getElementById("postFormWrapper").dataset.originalEmail;
        const newPost = {
        userEmail: originalEmail || loggedUser.email,
        text,
        timestamp: new Date().toISOString()
        };

    if (editingPostId) {
    await fetch(`${POSTS_URL}/${editingPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPost, id: editingPostId }),
    });

    updatePostInDOM({ ...newPost, id: editingPostId });
    logAction("Editó una publicación"); 
    editingPostId = null;
    } else {
    const res = await fetch(POSTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
    });

    const saved = await res.json();
    renderPost(saved);
    logAction("Creó una publicación"); 
    }


        textarea.value = "";
        document.getElementById("postFormWrapper").remove();
    });

    document.querySelector(".cancel_post_btn").addEventListener("click", () => {
        document.getElementById("postFormWrapper")?.remove();
        editingPostId = null;
    });
    }

    /* Editar publicación */
async function editPost(id) {
    const res = await fetch(`${POSTS_URL}/${id}`);
    const post = await res.json();

    createPostFormUI();
    document.getElementById("postTextarea").value = post.text;
    editingPostId = id;

    // Guardamos el email original como propiedad temporal
    document.getElementById("postFormWrapper").dataset.originalEmail = post.userEmail;
}


    /* Eliminar publicación */
    async function deletePost(id) {
        if (!confirm("¿Eliminar esta publicación?")) return;
        await fetch(`${POSTS_URL}/${id}`, { method: "DELETE" });

        document.querySelector(`.note__card[data-id="${id}"]`)?.remove();
        logAction("Eliminó una publicación"); //Agregar esta línea
    }

    /* Actualizar publicación en el DOM tras editar */
    function updatePostInDOM({ id, text, timestamp }) {
    const card = document.querySelector(`.note__card[data-id="${id}"]`);
    if (card) {
    card.querySelector(".post__text").textContent = text;
    card.querySelector("cite").textContent = new Date(timestamp).toLocaleString();
    }
    }


/* -------------------------------------------------------------------------- */
/* FUNCION GUARDIAN*/
/* -------------------------------------------------------------------------- */
function redirectToLogin() {
alert("Debes iniciar sesión.");
localStorage.removeItem("loggedUser");
window.location.href = "index.html";
}
