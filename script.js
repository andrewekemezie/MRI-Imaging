"use strict";

// Shared JavaScript for the website. Add future browser behavior here.
const demoButton = document.querySelector("#javascript-demo-button");

if (demoButton) {
    const demoStatus = document.querySelector("#javascript-demo-status");

    demoButton.addEventListener("click", () => {
        demoButton.textContent = "JavaScript is working!";
        demoButton.classList.add("is-working");
        demoStatus.textContent = "Success — your click was handled by script.js.";
    });
}
