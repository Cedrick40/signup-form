// ===== Validation rules (each returns an error message, or "" when the value is valid) =====

// A letter, then letters, spaces, hyphens or apostrophes. \p{L} matches letters in any language.
const NAME_PATTERN = /^\p{L}[\p{L}\s'’-]+$/u;

// Something, an @, something, a dot, and at least 2 letters at the end. No spaces.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateName(value) {
  const name = value.trim();
  if (name === "") return "Please enter your name.";
  if (name.length < 2) return "Your name must be at least 2 characters.";
  if (!NAME_PATTERN.test(name)) return "Use letters, spaces, hyphens or apostrophes only.";
  return "";
}

function validateEmail(value) {
  const email = value.trim();
  if (email === "") return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email, like name@example.com.";
  return "";
}

// Each password rule: a key, a label for error messages and a test
const PASSWORD_RULES = [
  { key: "length", label: "at least 8 characters", test: (p) => p.length >= 8 },
  { key: "upper",  label: "an uppercase letter",   test: (p) => /[A-Z]/.test(p) },
  { key: "lower",  label: "a lowercase letter",    test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "a number",              test: (p) => /\d/.test(p) },
  { key: "symbol", label: "a symbol",              test: (p) => /[^A-Za-z0-9\s]/.test(p) },
];

// Returns which rules pass, a strength level from 0 to 4, and an error message
function checkPassword(value) {
  const results = PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(value) }));
  const metCount = results.filter((r) => r.met).length;

  // Score: one point per rule met, plus one for a long password (12+ characters)
  const score = value === "" ? 0 : metCount + (value.length >= 12 ? 1 : 0);

  let level = 0;
  if (value !== "") {
    if (score <= 2) level = 1;          // Weak
    else if (score === 3) level = 2;    // Fair
    else if (score <= 5) level = 3;     // Good
    else level = 4;                     // Strong (every rule met and 12+ characters)
  }

  let message = "";
  if (value === "") {
    message = "Please enter a password.";
  } else {
    const missing = results.filter((r) => !r.met).map((r) => r.label);
    if (missing.length > 0) message = "Password needs " + missing.join(", ") + ".";
  }

  return { results, level, message };
}

const STRENGTH_LABELS = ["Enter a password", "Weak", "Fair", "Good", "Strong"];

// ===== DOM and form handling =====

const form = document.getElementById("signup-form");
const fields = {
  name:     { input: document.getElementById("name"),     error: document.getElementById("name-error"),     validate: (v) => validateName(v) },
  email:    { input: document.getElementById("email"),    error: document.getElementById("email-error"),    validate: (v) => validateEmail(v) },
  password: { input: document.getElementById("password"), error: document.getElementById("password-error"), validate: (v) => checkPassword(v).message },
};
const meterBar = document.getElementById("meter-bar");
const strengthText = document.getElementById("strength-text");
const ruleItems = document.querySelectorAll("#password-rules li");
const toggleBtn = document.getElementById("toggle-password");
const formView = document.getElementById("form-view");
const successView = document.getElementById("success-view");
const successText = document.getElementById("success-text");
const backBtn = document.getElementById("back");

const touched = { name: false, email: false, password: false };

// Show or clear the inline error under one field. Returns true when the field is valid.
function validateField(key) {
  const { input, error, validate } = fields[key];
  const message = validate(input.value);
  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  input.classList.toggle("valid", !message);
  return message === "";
}

function updatePasswordUI() {
  const { results, level } = checkPassword(fields.password.input.value);

  results.forEach((r) => {
    const li = document.querySelector('#password-rules [data-rule="' + r.key + '"]');
    li.classList.toggle("met", r.met);
    let hint = li.querySelector(".sr-only");
    if (!hint) {
      hint = document.createElement("span");
      hint.className = "sr-only";
      li.appendChild(hint);
    }
    hint.textContent = r.met ? " (met)" : " (not met)";
  });

  meterBar.dataset.level = String(level);
  strengthText.textContent = "Strength: " + STRENGTH_LABELS[level];
}

// Validate a field when the user leaves it, then keep checking as they type
Object.keys(fields).forEach((key) => {
  const { input } = fields[key];
  input.addEventListener("blur", () => {
    touched[key] = true;
    validateField(key);
  });
  input.addEventListener("input", () => {
    if (touched[key]) validateField(key);
    if (key === "password") updatePasswordUI();
  });
});

// Prevent submission until every field is valid
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let firstInvalid = null;
  Object.keys(fields).forEach((key) => {
    touched[key] = true;
    const ok = validateField(key);
    if (!ok && !firstInvalid) firstInvalid = fields[key].input;
  });

  if (firstInvalid) {
    firstInvalid.focus();               // take the user straight to the first problem
    return;
  }

  // All fields are valid. This is a front-end demo, so nothing is sent or saved.
  const firstName = fields.name.input.value.trim().split(/\s+/)[0];
  successText.textContent = "Welcome, " + firstName + ". This is a front-end demo, so no data was sent or saved.";
  formView.hidden = true;
  successView.hidden = false;
  backBtn.focus();
});

// Show or hide the password
toggleBtn.addEventListener("click", () => {
  const show = fields.password.input.type === "password";
  fields.password.input.type = show ? "text" : "password";
  toggleBtn.textContent = show ? "Hide" : "Show";
  toggleBtn.setAttribute("aria-pressed", String(show));
  toggleBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

// Back to a clean form
backBtn.addEventListener("click", () => {
  form.reset();
  Object.keys(fields).forEach((key) => {
    touched[key] = false;
    fields[key].error.textContent = "";
    fields[key].input.setAttribute("aria-invalid", "false");
    fields[key].input.classList.remove("valid");
  });
  fields.password.input.type = "password";
  toggleBtn.textContent = "Show";
  toggleBtn.setAttribute("aria-pressed", "false");
  toggleBtn.setAttribute("aria-label", "Show password");
  updatePasswordUI();
  successView.hidden = true;
  formView.hidden = false;
  fields.name.input.focus();
});

updatePasswordUI();