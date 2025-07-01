//  Declarar URL de logs
const LOGS_URL = "http://localhost:3000/logs";

// Función global para registrar logs
async function logAction(action = "Acción desconocida") {
	const user = JSON.parse(localStorage.getItem("loggedUser"));
	if (!user) return;

	const newLog = {
		userId: user.id,
		action,
		timestamp: new Date().toISOString(),
	};

	try {
		await fetch(LOGS_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newLog),
		});
	} catch (err) {
		console.error("Error registrando acción:", err);
	}
}