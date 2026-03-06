// function applyIubendaClasses() {
//     const privacyElements = document.querySelectorAll('.fui-field[data-field-handle="privacyPolicy"]');

//     privacyElements.forEach((el) => {
//         const link = el.querySelector("a");
//         if (link) {
//             link.classList.add("iubenda-white", "iubenda-noiframe", "iubenda-embed", "iubenda-nostyle");

//             // Wait for Iubenda’s embed to apply its own inline style
//             setTimeout(() => {
//                 link.style.width = "auto";
//             }, 500); // 1s delay is enough
//         }
//     });
// }

// document.addEventListener("DOMContentLoaded", applyIubendaClasses);
// document.addEventListener("formieRender", applyIubendaClasses);

function applyIubendaClasses() {
  const iubendaId = window.siteConfig?.iubenda;

  const privacyElements = document.querySelectorAll(
    '.fui-field[data-field-handle="privacyPolicy"]',
  );

  privacyElements.forEach((el) => {
    const link = el.querySelector("a");
    if (link) {
      // Update href with iubenda ID if available
      if (iubendaId && link.href.includes("iubenda.com")) {
        link.href = link.href.replace(
          /iubenda\.com\/[^/]+/,
          `iubenda.com/privacy-policy/${iubendaId}`,
        );
      }

      link.classList.add(
        "iubenda-white",
        "iubenda-noiframe",
        "iubenda-embed",
        "iubenda-nostyle",
        "text-prim",
      );

      // Wait for Iubenda's embed to apply its own inline style
      setTimeout(() => {
        link.style.width = "auto";
      }, 500);
    }
  });
}

document.addEventListener("DOMContentLoaded", applyIubendaClasses);
document.addEventListener("formieRender", applyIubendaClasses);
