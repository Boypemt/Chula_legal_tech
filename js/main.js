import { initTheme } from "./theme.js";

/** Mobile navigation: toggle the panel and keep aria-expanded in sync. */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

/** Tiny demo of event handling — delete once you have real features. */
function initCounter() {
  const button = document.querySelector("[data-counter]");
  const output = document.querySelector("[data-counter-value]");
  if (!button || !output) return;

  let count = 0;
  button.addEventListener("click", () => {
    count += 1;
    output.textContent = String(count);
  });
}

/** Client-side validation demo; replace with a real submit handler. */
function initForm() {
  const form = document.querySelector("[data-demo-form]");
  const status = document.querySelector("[data-form-status]");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Please fill in every field with a valid value.";
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Form submission (not sent anywhere yet):", data);
    status.textContent = "Thanks — this demo logs to the console instead of sending.";
    form.reset();
  });
}

function initYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

initTheme();
initNav();
initCounter();
initForm();
initYear();
