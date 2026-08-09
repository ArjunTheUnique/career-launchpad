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

  // Registration form -> WhatsApp
  document.getElementById('regForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('regName').value;
    var college = document.getElementById('regCollege').value;
    var year = document.getElementById('regYear').value;
    var branch = document.getElementById('regBranch').value;
    var question = document.getElementById('regQuestion').value;
    var msg = 'C3 Workshop Registration\n\nName: ' + name + '\nCollege: ' + college + '\nYear: ' + year + '\nBranch: ' + branch;
    if(question) msg += '\nQuestion: ' + question;
    msg += '\n\nI have attached my payment screenshot.';
    var url = 'https://wa.me/918686084844?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
  });