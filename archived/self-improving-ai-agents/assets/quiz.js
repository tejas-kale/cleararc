/* quiz.js — progressive enhancement for .quiz and .recall blocks.
   Markup contract:
     <div class="quiz" data-answer="b">
       <span class="label">Check yourself</span>
       <p class="q">…question…</p>
       <div class="opts">
         <button class="opt" data-opt="a">…</button>
         <button class="opt" data-opt="b">…</button>
       </div>
       <div class="answer-reveal"><p>…why…</p></div>
     </div>

     <div class="recall">
       <span class="label">Retrieval practice</span>
       <p class="prompt">…</p>
       <textarea …></textarea>
       <div class="model-answer"><p>…</p></div>
     </div>
   Letters (a, b, c…) are assigned automatically from DOM order. */

(function () {
  'use strict';

  function initQuiz(quiz) {
    var correct = (quiz.dataset.answer || '').trim().toLowerCase();
    var opts = Array.prototype.slice.call(quiz.querySelectorAll('button.opt'));

    opts.forEach(function (btn, i) {
      if (!btn.dataset.opt) btn.dataset.opt = String.fromCharCode(97 + i);
      var mark = document.createElement('span');
      mark.className = 'mark';
      mark.textContent = btn.dataset.opt.toUpperCase() + '.';
      btn.insertBefore(mark, btn.firstChild);

      btn.addEventListener('click', function () {
        if (quiz.classList.contains('is-answered')) return;
        quiz.classList.add('is-answered');
        opts.forEach(function (o) {
          o.disabled = true;
          if (o.dataset.opt === correct) o.classList.add('is-right');
        });
        if (btn.dataset.opt !== correct) btn.classList.add('is-wrong');
      });
    });
  }

  function initRecall(box) {
    if (box.querySelector('.reveal-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reveal-btn';
    btn.textContent = 'Show a model answer';
    btn.addEventListener('click', function () { box.classList.add('is-revealed'); });
    var ta = box.querySelector('textarea');
    (ta || box).insertAdjacentElement('afterend', btn);
  }

  function boot() {
    document.querySelectorAll('.quiz').forEach(initQuiz);
    document.querySelectorAll('.recall').forEach(initRecall);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
