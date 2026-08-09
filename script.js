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

  // Create hidden iframe for form submission (bypasses CORS)
  var hiddenIframe = document.createElement('iframe');
  hiddenIframe.name = 'hidden_iframe';
  hiddenIframe.id = 'hidden_iframe';
  hiddenIframe.style.display = 'none';
  document.body.appendChild(hiddenIframe);

  // Registration form -> Google Sheets via hidden iframe form post
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

      regBtn.disabled = true;
      regBtn.textContent = 'Submitting...';

      // Build a hidden form and submit via iframe to bypass CORS
      var form = document.createElement('form');
      form.method = 'POST';
      form.action = WEBHOOK_URL;
      form.target = 'hidden_iframe';

      var fields = {
        name: name,
        college: college,
        year: year,
        branch: branch,
        email: email,
        question: question
      };

      Object.keys(fields).forEach(function(key){
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      // Show success after delay (iframe cross-origin load is opaque)
      setTimeout(function() {
        document.body.removeChild(form);
        var formEl = document.getElementById('regForm');
        var successEl = document.getElementById('regSuccess');
        if (formEl) formEl.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      }, 2500);
    });
  }