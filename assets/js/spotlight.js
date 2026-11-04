/* SpotlightCard interaction adapted for static HTML from React Bits (DavidHDev/react-bits). */
document.querySelectorAll('.project-item').forEach(card => {
 card.addEventListener('pointermove', event => {
  if (!document.documentElement.classList.contains('motion-enabled') || event.pointerType === 'touch') return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--spot-x', `${event.clientX-rect.left}px`);
  card.style.setProperty('--spot-y', `${event.clientY-rect.top}px`);
 });
});
