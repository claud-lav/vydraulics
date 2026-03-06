// Glenn box sizing script add bc for box-container and b for box
// set height of children to height of highest child

if (document.querySelectorAll(".bc").length) {
  function bc() {
    document.querySelectorAll(".bc").forEach(function (bcElement) {
      let heights = [];
      let padding = 0;
      if (bcElement.getAttribute("padding") !== null) {
        padding = parseInt(bcElement.getAttribute("padding"));
      }
      bcElement.querySelectorAll(".b").forEach(function (bElement) {
        const childDiv = bElement;
        if (childDiv) {
          const height = childDiv.offsetHeight + padding;

          bElement.style.maxHeight = height + "px";
          heights.push(height);
        }
      });
      // console.log(heights);
      const max = Math.max(...heights);
      bcElement.querySelectorAll(".b").forEach(function (bElement) {
        bElement.style.height = max + "px";
        bElement.style.maxHeight = "unset";
      });
    });
  }

  window.addEventListener("resize", bc);
  bc();
}
