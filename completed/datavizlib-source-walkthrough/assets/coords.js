(function () {
  var board = document.querySelector("[data-coord-board]");
  if (!board) return;
  var out = board.querySelector("[data-coord-out]");
  board.querySelectorAll("[data-space]").forEach(function (el) {
    el.addEventListener("click", function () {
      board.querySelectorAll("[data-space]").forEach(function (n) {
        n.setAttribute("data-active", "false");
      });
      el.setAttribute("data-active", "true");
      if (out) out.textContent = el.getAttribute("data-explain");
    });
  });
})();
