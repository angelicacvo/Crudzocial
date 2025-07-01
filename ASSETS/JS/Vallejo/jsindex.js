// Obtener usuarios del localStorage o cargar usuarios iniciales

function getUsersFromStorage() { // Esta funcion nos permite recopilar informacion creada previamente (declarada en JS para despues aplicarlo en JSON)
  const storedUsers = localStorage.getItem("users"); // Con esta constante tomamos los elementos de "users"
  if (storedUsers) { // Creamos un bucle "si"
    return JSON.parse(storedUsers); // .parse nos permite crear crear un string JSON a un objeto JS
  } else {
    const defaultUsers = [ // Creamos constante de usuarios ya registrados en la base de datos (Se quitaran del JS para usar los del JSON)
      {
        id: "ff76",
        name: "admin",
        lastName: "admin",
        email: "4dm1n00001@gmail.com",
        phone: "3236285567",
        country: "United States",
        city: "Los Angeles",
        address: "123 Admin St",
        zipCode: "90001",
        password: "admin123"
      },
      {
        id: "aa12",
        name: "Luis Eduardo",
        lastName: "Martinez Perez",
        email: "lumar85@gmail.com",
        phone: "3236285567",
        country: "Colombia",
        city: "Cali",
        address: "Av. 8N No. 16N-25, Valle",
        zipCode: "760036",
        password: "contra123"
      },
      {
        id: "gg56",
        name: "Maria Elena",
        lastName: "Ruiz Jimenez",
        email: "meru2002@gmail.com",
        phone: "3125726422",
        country: "Colombia",
        city: "Medellin",
        address: "Cr 50 No. 52-50 DE 116",
        zipCode: "050015",
        password: "20meru02"
      }
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers)); // .stringify Convierte un objeto de JS en una cadena de texto para JSON
    return defaultUsers;
  }
}

function saveUsersToStorage(users) { // Con esta funcion buscamos guardar los usuarios al almacenamiento
  localStorage.setItem("users", JSON.stringify(users));
}

// Funcion del boton "Login"
const loginBtn = document.getElementById("loginBtn"); // Llamamos el boton login del HTML
loginBtn.addEventListener("click", function (e) { // Escuchamos el evento del click sobre el boton
  e.preventDefault(); // evita que el form se recargue

  const email = document.getElementById("exampleInputEmail1").value.trim(); // Buscamos el campo de email en el HTML, el .value es la info que el usuario puso y el .trim elimina espacios
  const password = document.getElementById("exampleInputPassword1").value.trim(); // Mismo proceso

  const users = getUsersFromStorage(); // Nos vamos a la funcion del inicio para recuperar la informacion y validarla
  const userFound = users.find((u) => u.email === email && u.password === password); // Los datos que el usuario ingreso deben de coincidir exactamente con la informacion de la base de datos

  if (userFound) {
    alert("Ingreso exitoso"); // Si el usuario ingreso datos correctos, se deja pasar
  } else {
    alert("Datos incorrectos"); // Si alguno de los datos esta mal, no lo permite pasar
  }
});

// Funcion del boton "Registro"
// Por lo general ya se explico la mayoria de cosas entonces nos vamos a enfocar en informacion no dada previamente
const registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const name = document.getElementById("registerSectionName").value.trim();
  const lastName = document.getElementById("registerSectionLastname").value.trim();
  const email = document.querySelector("#register input[type='email']").value.trim(); // Al usar el .querySelector, especificamos que el campo del que vamos a guardar la informacion es del email en la parte de registro
  const phone = document.getElementById("registerSectionPhone").value.trim();
  const country = document.querySelectorAll("#register input")[4].value.trim(); // Señalamos que es el input #5 del apartado de "Registro"
  const city = document.getElementById("registerSectionCity").value.trim();
  const address = document.getElementById("registerSectionAddress").value.trim();
  const zipCode = document.getElementById("registerSectionPostal").value.trim();
  const password = document.getElementById("registerSectionPassword").value.trim();


  if (!name || !lastName || !email || !phone || !country || !city || !address || !zipCode || !password) { // Decimos que si algun campo esta vacio (! significa NO), envia la alerta de que hay un campo vacio
    alert("Falta llenar un campo");
    return;
  }

  const users = getUsersFromStorage(); // Llamamos la funcion de la lista de usuarios ya creados
  const alreadyExists = users.some((u) => u.email === email); // Comparamos si un correo ya existente es igual al que el usuario acabo de escribir
  if (alreadyExists) { // Si la condicion se cumple, no permite registrarse y manda mensaje de error
    alert("Ya existe un usuario con este correo");
    return;
  }

  const newUser = {
    id: Math.random().toString(36).substring(2, 6), // Para el ID del nuevo usuario, creamos un pin con numeros aleatorios, letras y selecciona solo cuatro caracteres para el nuevo ID
    name,
    lastName,
    email,
    phone,
    country,
    city,
    address,
    zipCode,
    password
  };

  users.push(newUser); // Guardamos al nuevo usuario al final de USERS
  saveUsersToStorage(users); // Guarda al usuario en la base de datos

  alert("Registro exitoso");
  document.querySelector("#register form").reset(); // Limpiamos el formulario despues de que el registro fue exitoso
});

const loginSection = document.getElementById("login");
const registerSection = document.getElementById("register");

const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

showLogin.addEventListener("click", function (e) {
  e.preventDefault();
  loginSection.classList.remove("d-none");
  registerSection.classList.add("d-none");
});

showRegister.addEventListener("click", function (e) {
  e.preventDefault();
  registerSection.classList.remove("d-none");
  loginSection.classList.add("d-none");
});
