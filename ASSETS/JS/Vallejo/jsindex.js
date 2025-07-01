// URL base de la API de usuarios en json-server
const API_URL = "http://localhost:3000/users";

// Obtener todos los usuarios del servidor (GET)
async function getUsersFromServer() {
	const response = await fetch(API_URL); // Llama a la API
	const users = await response.json();   // Convierte la respuesta en JSON
	return users;                          // Devuelve el array de usuarios
}

// Guardar nuevo usuario en el servidor (POST)
async function saveUserToServer(user) {
	const response = await fetch(API_URL, {
		method: "POST", // Método POST para crear nuevo recurso
		headers: { "Content-Type": "application/json" }, // Indicamos que se enviará JSON
		body: JSON.stringify(user) // Convertimos el objeto a texto JSON
	});
	return response.ok; // Devuelve true si el servidor respondió con 2xx
}

// Evento de login (verifica credenciales y redirige si son válidas)
document.getElementById("loginBtn").addEventListener("click", async function (e) {
	e.preventDefault(); // Evita el envío del formulario

	// Obtener valores de los campos de login
	const email = document.getElementById("exampleInputEmail1").value.trim();
	const password = document.getElementById("exampleInputPassword1").value.trim();

	// Obtener lista de usuarios desde el servidor
	const users = await getUsersFromServer();

	// Buscar si existe un usuario con ese correo y contraseña
	const userFound = users.find(u => u.email === email && u.password === password);

	if (userFound) {
		alert("Ingreso exitoso");

		// Guardar datos del usuario en localStorage
		localStorage.setItem("loggedUser", JSON.stringify(userFound));

		// Registrar log
		await logAction("Inició sesión");

		// Redirigir al home
		window.location.href = "home.html";
	} else {
		alert("Datos incorrectos");
	}
});

// Evento de registro (valida campos, guarda usuario, muestra login)
document.getElementById("registerBtn").addEventListener("click", async function (e) {
	e.preventDefault(); // Evita el envío del formulario

	// Obtener valores del formulario de registro
	const inputs = {
		name: document.getElementById("registerSectionName").value.trim(),
		lastName: document.getElementById("registerSectionLastname").value.trim(),
		email: document.getElementById("registerSectionEmail").value.trim(),
		phone: document.getElementById("registerSectionPhone").value.trim(),
		country: document.getElementById("registerSectionCountry").value.trim(),
		city: document.getElementById("registerSectionCity").value.trim(),
		address: document.getElementById("registerSectionAddress").value.trim(),
		zipCode: document.getElementById("registerSectionPostal").value.trim(),
		password: document.getElementById("registerSectionPassword").value.trim()
	};

	// Validar si algún campo está vacío
	const emptyFields = Object.entries(inputs)
		.filter(([_, value]) => !value) // Filtra los campos vacíos
		.map(([key]) => key); // Devuelve el nombre del campo

	if (emptyFields.length > 0) {
		// Generar mensaje de alerta con los campos faltantes
		const camposFaltantes = emptyFields
			.map(campo => campo.charAt(0).toUpperCase() + campo.slice(1))
			.join(", ");
		alert(`Faltan ${emptyFields.length} campo(s): ${camposFaltantes}`);
		return;
	}

	// Verificar si ya existe un usuario con el mismo correo
	const users = await getUsersFromServer();
	const alreadyExists = users.some(u => u.email === inputs.email);

	if (alreadyExists) {
		alert("Ya existe un usuario con este correo");
		return;
	}

	// Enviar nuevo usuario al servidor
	const success = await saveUserToServer(inputs);

if (success) {
	alert("Registro exitoso. Ahora inicia sesión.");

	// Guardar temporalmente el usuario para registrar log
	localStorage.setItem("loggedUser", JSON.stringify(inputs));

	// Registrar log de registro
	await logAction("Se registró en el sistema");

	// Eliminar del localStorage si no quieres que quede logueado aún
	localStorage.removeItem("loggedUser");

	// Cambiar a la vista de login automáticamente
	document.getElementById("register").classList.add("d-none");
	document.getElementById("login").classList.remove("d-none");

	// Limpiar los campos del formulario
	document.querySelector("#register form").reset();
} else {
	alert("Hubo un error al guardar el usuario");
}
});


// Mostrar el formulario de login y ocultar el de registro
document.getElementById("showLogin").addEventListener("click", function (e) {
	e.preventDefault();
	document.getElementById("login").classList.remove("d-none");
	document.getElementById("register").classList.add("d-none");
});

// Mostrar el formulario de registro y ocultar el de login
document.getElementById("showRegister").addEventListener("click", function (e) {
	e.preventDefault();
	document.getElementById("register").classList.remove("d-none");
	document.getElementById("login").classList.add("d-none");
});
