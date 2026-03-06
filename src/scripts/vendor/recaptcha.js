// Add reCAPTCHA notice to all Formie forms
document.querySelectorAll(".fui-form").forEach((form) => {
  const notice = document.createElement("p");
  notice.className = "recaptcha-notice";
  notice.innerHTML =
    'This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.';
  form.appendChild(notice);
});
