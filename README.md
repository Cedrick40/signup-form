# Signup Form with Validation

A static, responsive signup form with name, email and password fields, inline error messages, a password strength indicator and no submission until everything is valid. Built for Task 26 (Signup Form with Validation) of my Web Development internship.

**Live page:** https://cedrick40.github.io/signup-form/

## About the project
The form asks for a full name, an email address and a password. Each field is checked with its own rules, and a clear error message appears directly under the field that has the problem. While the user types a password, a checklist shows which requirements are met and a coloured bar shows how strong the password is. The form cannot be submitted until all three fields are valid, and then a success message is shown. This is a front-end demo, so nothing is sent or saved.

## Objective
To practice form validation, regular expressions and user feedback.

## Tools used
- HTML5
- CSS3
- JavaScript
- VS Code
- Git and GitHub (free)

## My approach
- **Planning:** I wrote down the rules for each field and decided when to show errors: when the user leaves a field, while they fix it, and when they press Submit.
- **Turning off the browser's own messages:** The form has `novalidate`, so my inline messages appear instead of the browser's popups, and the design stays consistent.
- **Name validation:** `validateName()` trims the value and returns a message for an empty name, a name shorter than 2 characters, and a name that does not match `/^\p{L}[\p{L}\s'’-]+$/u`. `\p{L}` matches letters in any language, so names such as José or Zoë are accepted, while digits and symbols are not.
- **Email validation with a regular expression:** `validateEmail()` trims the value and tests it against `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`. This requires some text, one `@`, a domain, a dot and at least two letters at the end, with no spaces.
- **Password validation:** A list of five rules (8 or more characters, an uppercase letter, a lowercase letter, a number and a symbol) is tested with regular expressions such as `/[A-Z]/` and `/\d/`. The error message names exactly what is missing, for example "Password needs a number, a symbol."
- **Password strength indicator:** The strength score is one point for each rule met, plus one more for a long password of 12 or more characters. The score maps to four levels: Weak (red), Fair (amber), Good (light green) and Strong (green, which needs every rule and 12 or more characters). It is drawn as a bar plus a text label, so colour is never the only signal. The checklist under the field also turns green and shows a tick for each rule that is met.
- **Inline errors:** Each field has its own error paragraph under it, linked with `aria-describedby`, and the input gets `aria-invalid="true"` and a red border. Valid fields get a green border.
- **When to validate:** A field is checked when the user leaves it (the `blur` event). After that, it is checked again on every keystroke, so the error disappears as soon as the problem is fixed. This avoids shouting at the user before they have finished typing.
- **Preventing submission until valid:** The `submit` handler calls `preventDefault()`, validates all three fields and, if any are invalid, moves focus to the first invalid field and stops. Only when every field is valid does it show the success message.
- **Show or hide password:** A button switches the input between `type="password"` and `type="text"`, and uses `aria-pressed` and an updated `aria-label`.
- **Accessibility:** Every input has a label, errors are announced with `aria-live="polite"`, the checklist items have hidden "(met)" and "(not met)" text, and keyboard focus is clearly visible.
- **Layout and responsive design:** The card is centred and limited to 460px wide. The checklist is two columns on larger screens and one column on screens of 440px and below.
- **Design:** The page uses neutral greys with dark text and buttons. Colour is kept for meaning: red for errors, green for valid fields and a red to green scale for strength.
- **Testing:** I tested valid and invalid names, emails and passwords (including accented names, an email without a dot suffix and a password that was missing only a symbol), submitting an empty form, fixing errors one at a time, the strength levels, the show and hide button and the Back to the form button. I also resized the browser to check the mobile layout.

## Project structure
```
signup-form/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Outcome
The result is a clean, accessible signup form with three validated fields, specific inline messages, a live password checklist and strength bar, and a submit button that does nothing until the form is valid. This project taught me how regular expressions describe the shape of text, why errors belong next to the field they are about, and how timing (on blur, then on input) makes validation feel helpful instead of annoying.

## Interview questions
- **How would you validate an email with a regular expression?** Trim the value, then test it with a pattern that requires text, an `@`, a domain and a dot followed by a suffix, with no spaces, such as `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`. A regular expression only checks the shape, not whether the mailbox exists, so a real service should also validate on the server and send a confirmation email.
- **Why show inline errors instead of an alert?** An alert interrupts the user, hides the form while it is open, disappears once dismissed and says nothing about which field is wrong. An inline message stays next to the field, can show all problems at once, updates as the user fixes it, and can be linked to the input with `aria-describedby` so screen readers read it. It also feels less aggressive.
- **How would you check password strength?** Test the password against several rules (length, uppercase, lowercase, numbers, symbols), score how many are met, give extra credit for length, and map the score to levels such as Weak, Fair, Good and Strong. For production, a library such as zxcvbn is better, because it also spots common passwords and predictable patterns that simple rules miss. Real validation of passwords must also happen on the server.

## Credits
Validation follows the MDN documentation for form validation and regular expressions. The font is Manrope from Google Fonts.

## Author
Cedrick Niyibikora