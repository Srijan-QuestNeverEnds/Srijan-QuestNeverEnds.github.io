$(document).ready(function () {
  // Draw dotted lines in services section
  //drawLines();
  window.onresize = function (event) {
    drawLines();
  };

  //disable background video for phones
  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || screen.width < 500) {
    var video = document.getElementById('video');
    video.remove();
  }

  //stop float from being pushed down
  var leftHeight = $('.content-left').height() * -1;
  $('.content-right').css('margin-top', leftHeight);

  // change transparency on header
  $(document).scroll(function () {
    if ($(document).scrollTop() > 5) {
      if (!$('#nav-container').hasClass('nav-body')) {
        $('#nav-container').addClass('nav-body');
      }
    } else if ($(document).scrollTop() < 5) {
      if ($('#nav-container').hasClass('nav-body')) {
        $('#nav-container').removeClass('nav-body');
      }
    }
  });

  //show mobile dropdown menu
  $('#nav .icon').click(function () {
    $('#mobile-dropdown').fadeToggle('fast');
  });

  //smooth scrolling anchor tags - https://css-tricks.com/snippets/jquery/smooth-scrolling/
  $(function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });
});
