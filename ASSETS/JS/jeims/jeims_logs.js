const LOGS_API = "http://localhost:3000/logs";
const USERS_API = "http://localhost:3000/users";

document.addEventListener("DOMContentLoaded", async () => {
	const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

	if (!loggedUser || !loggedUser.email || !loggedUser.name) {
		alert("Debes iniciar sesión.");
		localStorage.removeItem("loggedUser");
		window.location.href = "index.html";
		return;
	}

	const isAdmin = loggedUser.email === "4dm1n00001@gmail.com";

	// Botón de cerrar sesión
	document.querySelectorAll(".logout__btn").forEach((btn) =>
		btn.addEventListener("click", () => {
			if (confirm("¿Seguro que deseas cerrar sesión?")) {
				localStorage.removeItem("loggedUser");
				window.location.href = "index.html";
			}
		})
	);
	// Mostrar nombre en perfil
	const profileNameEl = document.querySelectorAll(".profile__name a")[0];
	if (profileNameEl) profileNameEl.textContent = loggedUser.name;

	try {
		const [logsRes, usersRes] = await Promise.all([
			fetch(LOGS_API),
			fetch(USERS_API),
		]);

		let logs = await logsRes.json();
		const users = await usersRes.json();

		// Si NO es admin, mostrar solo sus logs
		if (!isAdmin) {
			logs = logs.filter((log) => log.userId === loggedUser.id);
		}

		renderLogs(logs, users);
		renderUserFilters(users, logs, isAdmin, loggedUser.id);
		renderDateFilters(logs);
	} catch (err) {
		console.error("Error cargando logs:", err);
	}
});

/* Mostrar logs en tabla */
function renderLogs(logs, users) {
	const tableBody = document.getElementById("logsTableBody");
	tableBody.innerHTML = "";

	logs.forEach((log, index) => {
		const user = users.find((u) => u.id === log.userId);

		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${index + 1}</td>
			<td>${user?.name || "Desconocido"}</td>
			<td>${user?.email || "Sin correo"}</td>
			<td>${log.action}</td>
			<td>${new Date(log.timestamp).toLocaleString()}</td>
		`;

		tableBody.appendChild(row);
	});
}

/* Filtros por usuario */
function renderUserFilters(users, logs, isAdmin, currentUserId) {
	const userFilterList = document.getElementById("userFilterList");
	userFilterList.innerHTML = "";

	// Usuarios con al menos un log
	const usersWithLogs = [...new Set(logs.map((log) => log.userId))];

	const filteredUsers = users.filter((u) =>
		isAdmin ? usersWithLogs.includes(u.id) : u.id === currentUserId
	);

	filteredUsers.forEach((user) => {
		const li = document.createElement("li");
		li.innerHTML = `<button class="dropdown-item">${user.name}</button>`;
		li.addEventListener("click", () => {
			const userLogs = logs.filter((log) => log.userId === user.id);
			renderLogs(userLogs, users);
		});
		userFilterList.appendChild(li);
	});
}

/* Filtros por fecha */
function renderDateFilters(logs) {
	const dateFilterList = document.getElementById("dateFilterList");
	dateFilterList.innerHTML = "";

	const uniqueDates = [...new Set(
		logs.map((log) => new Date(log.timestamp).toLocaleDateString())
	)];

	uniqueDates.forEach((date) => {
		const li = document.createElement("li");
		li.innerHTML = `<button class="dropdown-item">${date}</button>`;
		li.addEventListener("click", () => {
			const filteredLogs = logs.filter((log) =>
				new Date(log.timestamp).toLocaleDateString() === date
			);

			fetch(USERS_API)
				.then((res) => res.json())
				.then((users) => renderLogs(filteredLogs, users));
		});
		dateFilterList.appendChild(li);
	});
}
