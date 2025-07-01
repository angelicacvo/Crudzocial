const USERS_URL = "http://localhost:3000/users";
let loggedUser = null;
let user = null;

window.addEventListener("DOMContentLoaded", async () => {
	loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
	if (!loggedUser?.email || !loggedUser?.name) return redirectToLogin();

	try {
		const res = await fetch(USERS_URL);
		const users = await res.json();

		user = users.find(
			(u) => u.email === loggedUser.email && u.name === loggedUser.name
		);
		if (!user) return redirectToLogin()

		// Mostrar nombre en pantalla
		const profileLinks = document.querySelectorAll(".profile__name a");
		if (profileLinks[0]) profileLinks[0].textContent = user.name;

		const nameTitle = document.querySelector(".profile__name--h3");
		if (nameTitle) nameTitle.textContent = `${user.name} ${user.lastName || ""}`;

		// Llenar campos
		document.getElementById("inputName").value = user.name || "";
		document.getElementById("inputLastName").value = user.lastName || "";
		document.getElementById("inputEmail").value = user.email || "";
		document.getElementById("inputPassword").value = user.password || "";
		document.getElementById("inputPhone").value = user.phone || "";
		document.getElementById("inputCountry").value = user.country || "";
		document.getElementById("inputCity").value = user.city || "";
		document.getElementById("inputAddress").value = user.address || "";
		document.getElementById("inputZip").value = user.zipCode || "";

		// Botones
		const fieldset = document.getElementById("profileFieldset");
		const editBtn = document.getElementById("editBtn");
		const saveBtn = document.getElementById("saveBtn");

		editBtn?.addEventListener("click", (e) => {
			e.preventDefault();
			fieldset.disabled = false;
		});

		saveBtn?.addEventListener("click", async (e) => {
			e.preventDefault(); // Previene comportamiento por defecto
			if (!user?.id) return alert("Error: usuario no válido.");

			const updatedUser = {
				...user,
				name: document.getElementById("inputName").value.trim(),
				lastName: document.getElementById("inputLastName").value.trim(),
				email: document.getElementById("inputEmail").value.trim(),
				password: document.getElementById("inputPassword").value.trim(),
				phone: document.getElementById("inputPhone").value.trim(),
				country: document.getElementById("inputCountry").value.trim(),
				city: document.getElementById("inputCity").value.trim(),
				address: document.getElementById("inputAddress").value.trim(),
				zipCode: document.getElementById("inputZip").value.trim(),
			};

			try {
				const res = await fetch(`${USERS_URL}/${user.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedUser),
				});

				if (!res.ok) throw new Error("Error al guardar");

				localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
				alert("Datos guardados correctamente.");

				fieldset.disabled = true;
				user = updatedUser; // actualizar usuario en JS

				// Actualizar nombre en la pantalla
				if (profileLinks[0]) profileLinks[0].textContent = updatedUser.name;
				if (nameTitle) nameTitle.textContent = `${updatedUser.name} ${updatedUser.lastName}`;

			} catch (err) {
				console.error(err);
				alert("No se pudieron guardar los cambios.");
			}
		});

		// Logout
		document.querySelectorAll(".logout__btn").forEach((btn) =>
			btn.addEventListener("click", () => {
				if (confirm("¿Cerrar sesión?")) {
					localStorage.removeItem("loggedUser");
					window.location.href = "index.html";
				}
			})
		);

	} catch (err) {
		console.error("Error al cargar usuario:", err);
		redirectToLogin();
	}
});

function redirectToLogin() {
	alert("Debes iniciar sesión.");
	localStorage.removeItem("loggedUser");
	window.location.href = "index.html";
}

// Previene envío por Enter
document.querySelector(".content__container--form").addEventListener("submit", (e) => {
	e.preventDefault();
});
