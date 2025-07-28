// Automatically enable tactile feedback for glass cards on touch devices only
function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

if (isTouchDevice()) {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.glass-card').forEach(card => {
      const removeActive = () => card.classList.remove('touch-active');
      card.addEventListener('touchstart', () => card.classList.add('touch-active'));
      card.addEventListener('touchend', removeActive);
      card.addEventListener('touchcancel', removeActive);
      card.addEventListener('mouseup', removeActive);
      card.addEventListener('click', removeActive);
      card.addEventListener('blur', removeActive);
      card.addEventListener('touchmove', removeActive);
    });
  });
}
