// if (!localStorage.getItem("imagenes")) {
//     localStorage.setItem("imagenes", JSON.stringify([]));
// }

// if (!localStorage.getItem("notas")) {
//     localStorage.setItem("notas", JSON.stringify([]));
// }

// function getInformation(key) {
//     return JSON.parse(localStorage.getItem(key)) || [];
// }

// function safeInformation(key, data) {
//     localStorage.setItem(key, JSON.stringify(data));
// }

// let notes = getInformation("notas");
// notes.push({ title: "Diario", content: "Hola mundo, estoy bien" });
// safeInformation("notas", notes);

// let images = getInformation("imagenes");
// images.push({ url_image: "imagen_1"});
// safeInformation("imagenes", images);