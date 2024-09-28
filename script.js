urlBase = 'https://jsonplaceholder.typicode.com/posts' //URL para interactuar
let posts = [] // iniciamos con array vacio

function getData() {
    fetch(urlBase)
    .then(res => res.json())
    .then(data => {
        posts = data 
        renderPostList()
    })
    .catch(error => console.error ('Error al llamar a la API: ',error))    
}

getData()

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li'); // Corrected 'createElement' to 'document.createElement'
        listItem.classList.add('postItem');
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button> <!-- Fixed button syntax -->
        <button onclick="deletePost(${post.id})">Borrar</button> <!-- Fixed button syntax -->

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody">Comentario</label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>
        `;
        postList.appendChild(listItem); // Corrected 'post' to 'postList'
    });
}
function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() === '' || postBody.trim() === '') {
        alert('Los campos son obligatorios');
        return;
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(data => {
            posts.unshift(data); // Add the new post to the posts array
            renderPostList(); // Re-render the post list to include the new post
            postTitleInput.value = ''
            postBodyInput.value = ''
        })
        .catch(error => console.error('Error al querer crear posteo:', error));
}

function editPost(id){

    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none';
    
}
function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`);
    const editBody = document.getElementById(`editBody-${id}`);

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle.value, // Updated values
            body: editBody.value,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then(response => response.json())
    .then(data => {
        // Update the post in the posts array
        const postIndex = posts.findIndex(post => post.id === id);
        posts[postIndex] = data;
        renderPostList(); // Re-render the list with updated post
    })
    .catch(error => console.error('Error al actualizar el posteo: ', error));
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Eliminar el post del array de posts
            posts = posts.filter(post => post.id !== id);
            renderPostList(); // Volver a renderizar la lista
        } else {
            console.error('Error al borrar el post:', response.statusText);
        }
    })
    .catch(error => console.error('Error al borrar el post:', error));
}

