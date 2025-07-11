import type { Ref } from 'vue'

export function useClickOutside(targetRef: Ref<HTMLElement | null>, callback: () => void) {
  const handleClick = (event: MouseEvent) => {
    const el = targetRef.value;
    if (!el) return;
    if (!(el === event.target || el.contains(event.target as Node))) {
      callback();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick);
  });
}
