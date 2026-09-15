/**
 * Decorative canvas / WebGL loops only need to run while they're actually
 * visible. This wires an IntersectionObserver + the page visibility API to a
 * single boolean callback: `true` when `el` is on (or near) screen and the tab
 * is focused, `false` otherwise. Callers start/stop their rAF loop accordingly.
 *
 * @param {Element} el                element whose visibility gates the loop
 * @param {(active: boolean) => void} onChange
 * @returns {() => void}              teardown
 */
export function trackRafActivity(el, onChange) {
  let inView = true;
  let visible = typeof document !== 'undefined' ? !document.hidden : true;
  let last = null;

  const emit = () => {
    const next = inView && visible;
    if (next !== last) {
      last = next;
      onChange(next);
    }
  };

  // 200px margin so the loop is already running by the time it scrolls in.
  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      emit();
    },
    { rootMargin: '200px' }
  );
  io.observe(el);

  const onVisibility = () => {
    visible = !document.hidden;
    emit();
  };
  document.addEventListener('visibilitychange', onVisibility);

  emit();

  return () => {
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
