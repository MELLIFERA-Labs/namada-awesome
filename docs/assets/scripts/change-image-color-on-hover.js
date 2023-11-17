function changeImage(element) {
  element.querySelector("img").src = `${element
    .querySelector("img")
    .src.replace("black", "yellow")}`;
}

function resetImage(element) {
  element.querySelector("img").src = `${element
    .querySelector("img")
    .src.replace("yellow", "black")}`;
}

