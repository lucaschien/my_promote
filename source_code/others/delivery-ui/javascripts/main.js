$(function() {
  // 解決桌機,手機css height 100vh的問題
  function calcWindowsVH() {
    let windowsVH = window.innerHeight / 100;
    document.querySelector('.main').style.setProperty('--vh', windowsVH + 'px');
  }
  calcWindowsVH();
  window.addEventListener('resize', calcWindowsVH);

  // 通用事件 - 所有高版的 dialog 都可以用此關閉 dialog
  $('body').on('click', '.close-dialog-btn', function() {
    $(this).parents('.dialog-component:first').removeClass('show');
  });

});