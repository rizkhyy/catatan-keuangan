const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "iky" && password === "123456789") {

        localStorage.setItem("isLogin", "true");

        window.location.href = "index.html";

    } else {

        loginMessage.textContent = "Username atau password salah!";
        loginMessage.className = "error-message";

    }

});
