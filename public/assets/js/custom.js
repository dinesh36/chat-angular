+function ($) {

  $(function(){

      // nav
      $(document).on('click', '[ui-nav] a', function (e) {
        var $this = $(e.target), $active;
        $this.is('a') || ($this = $this.closest('a'));
        
        $active = $this.parent().siblings( ".active" );
        $active && $active.toggleClass('active').find('> ul:visible').slideUp(200);
        
        ($this.parent().hasClass('active') && $this.next().slideUp(200)) || $this.next().slideDown(200);
        $this.parent().toggleClass('active');
        
        $this.next().is('ul') && e.preventDefault();
      });

  });
}(jQuery);


+function ($) {

  $(function(){

      $(document).on('click', '[ui-toggle-class]', function (e) {
        e.preventDefault();
        var $this = $(e.target);
        $this.attr('ui-toggle-class') || ($this = $this.closest('[ui-toggle-class]'));
        
    var classes = $this.attr('ui-toggle-class').split(','),
      targets = ($this.attr('target') && $this.attr('target').split(',')) || Array($this),
      key = 0;
    $.each(classes, function( index, value ) {
      var target = targets[(targets.length && key)];
      $( target ).toggleClass(classes[index]);
      key ++;
    });
    $this.toggleClass('active');

      });
  });
}(jQuery);


+function ($) {

  $(function(){

    // Checks for ie
    var isIE = !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./);
    isIE && $('html').addClass('ie');

  // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
  var ua = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
  (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua) && $('html').addClass('smart');

  });
}(jQuery);