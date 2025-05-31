const xhr = new XMLHttpRequest();

xhr.addEventListener("load", () => {
  console.log(typeof xhr.response);
});

xhr.open("GET", "https://supersimplebackend.dev");
xhr.send();
