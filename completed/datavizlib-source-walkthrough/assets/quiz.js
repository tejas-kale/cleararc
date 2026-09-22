(function () {
  function bindQuiz(root) {
    var answered = false;
    var buttons = root.querySelectorAll("button[data-correct]");
    var feedback = root.querySelector(".feedback");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var ok = btn.getAttribute("data-correct") === "true";
        buttons.forEach(function (other) {
          var right = other.getAttribute("data-correct") === "true";
          other.setAttribute("data-state", right ? "right" : "wrong");
          other.disabled = true;
        });
        if (feedback) {
          feedback.textContent = ok
            ? root.getAttribute("data-ok") || "Correct."
            : root.getAttribute("data-no") || "Not quite — look at the highlighted answer.";
        }
      });
    });
  }

  document.querySelectorAll(".quiz").forEach(bindQuiz);
})();
