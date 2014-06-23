(function(document,undef) { var global= this, _ = global._ ;

function init(modalsel, perspective, yes,no) {
  var overlay = $('.md-overlay'),
  modal = $(modalsel),
  confirm = $('.md-confirm', modal),
  cancel = $('.md-cancel', modal),
  removeModal=function() {
    overlay.off('click', removeModal);
    modal.removeClass( 'md-show' );
    if (perspective) {
      $(document.documentElement).removeClass( 'md-perspective' );
    }
  },
  cf= function() {
    removeModal();
    confirm.off('click',cf);
    if (yes) { yes(); }
  },
  cn= function() {
    removeModal();
    cancel.off('click',cf);
    if (no) { no(); }
  };

  if (cancel) { cancel.on('click', cn); }
  confirm.on('click', cf);

  return {
    open: function() {
      modal.addClass( 'md-show' );
      overlay.off('click', removeModal);
      overlay.on( 'click', removeModal);
      if (perspective) {
        setTimeout( function() {
          $(document.documentElement).addClass( 'md-perspective' );
        }, 25 );
      }
    }
  };
}

global.ModalWindow = {
  Init: init
};


}).call(this, document);


