// Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Draw-on animation for the action-cycle arc
  var arc = document.getElementById('cycleArc');
  if (arc) {
    var len = arc.getTotalLength();
    arc.style.strokeDasharray = len;
    arc.style.strokeDashoffset = len;
    window.requestAnimationFrame(function () {
      setTimeout(function () {
        arc.style.transition = 'stroke-dashoffset 1.6s ease';
        arc.style.strokeDashoffset = '0';
      }, 250);
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(f){ f.classList.remove('open'); });
      if(!isOpen) item.classList.add('open');
    });
  });

  // Registration form -> Google Sheets via Apps Script webhook
  var WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwtbx0BCUuix9vDz_ygGtktAjzyG4_QDvmKMsnQB59YifezHWm0XgRFEb1QD9lpLh0r9g/exec';
  var regBtn = document.getElementById('submitRegistration');
  if (regBtn) {
    regBtn.addEventListener('click', function(){
      var name = (document.getElementById('regName').value || '').trim();
      var college = (document.getElementById('regCollege').value || '').trim();
      var year = document.getElementById('regYear').value;
      var branch = (document.getElementById('regBranch').value || '').trim();
      var email = (document.getElementById('regEmail').value || '').trim();

      if(!name || !college || !year || !branch || !email){
        alert('Please fill in all required fields before submitting.');
        return;
      }

      var question = (document.getElementById('regQuestion').value || '').trim();
      var data = {
        name: name,
        college: college,
        year: year,
        branch: branch,
        email: email,
        question: question
      };

      // Disable button, show "Submitting..."
      regBtn.disabled = true;
      regBtn.textContent = 'Submitting...';

      // POST to Google Sheets webhook (no-cors: we can't read response, but data goes through)
      fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      }).then(function() {
        // Show success message, hide form
        var formEl = document.getElementById('regForm');
        var successEl = document.getElementById('regSuccess');
        if (formEl) formEl.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      }).catch(function(err) {
        regBtn.disabled = false;
        regBtn.textContent = 'Submit Registration \u2192';
        alert('Something went wrong. Please try again, or WhatsApp us at +91 86860 84844.');
      });
    });
  }