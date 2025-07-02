export async function sendDiscordWebhook(test) {
	// URL del webhook de Discord (reemplázala si es necesario)
	const WEBHOOK_URL = "https://discord.com/api/webhooks/1389729819884781896/8WZfN5z_s89GC08BI61CEJuN4e29Yzu0mhslaeOQShNhF3l0PqyYWIPbj_zamfY42s9n";

	// Desestructuramos el objeto de entrada (título, descripción, campos, color)
	const {
		title,
		description,
		fields = [],
		color = 0x3498db // Color por defecto si no se pasa uno
	} = test;

	// Construimos el objeto embed que Discord espera
	const embed = {
		title,
		description,
		color,
		timestamp: new Date().toISOString(), // Fecha/hora actual en formato ISO
		fields
	};

	try {
		// Enviamos la solicitud al webhook
		const response = await fetch(WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ embeds: [embed] }) // Enviamos el embed dentro de un array
		});

		// Si la respuesta no fue exitosa, lanzamos un error
		if (!response.ok) {
			throw new Error(`Webhook failed: ${response.status}`);
		}

		// Confirmación de éxito
		console.log("✅ Webhook enviado con éxito");
	} catch (error) {
		// Mostramos cualquier error que ocurra
		console.error("❌ Error enviando webhook:", error);
	}
}
