$(function() {
  // 通用事件 - 所有高版的 dialog 都可以用此關閉 dialog
  $('body').on('click', '.close-dialog-btn', function() {
    $(this).parents('.dialog-component:first').removeClass('show');
  });

});