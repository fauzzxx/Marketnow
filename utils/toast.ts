export type ToastType = "success" | "error" | "info" | "loading";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toasts: Toast[] = [];
let listeners: Array<(t: Toast[]) => void> = [];

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function getToasts(): Toast[] {
  return [...toasts];
}

export function subscribe(fn: (t: Toast[]) => void): () => void {
  listeners.push(fn);
  fn([...toasts]);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function toast(
  message: string,
  type: ToastType = "info",
  duration = 4000
): string {
  const id = Math.random().toString(36).slice(2);
  const t: Toast = { id, type, message, duration };
  toasts = [...toasts, t];
  notify();
  if (type !== "loading" && duration > 0) {
    setTimeout(() => {
      toasts = toasts.filter((x) => x.id !== id);
      notify();
    }, duration);
  }
  return id;
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function updateToast(id: string, payload: Partial<Toast>): void {
  toasts = toasts.map((t) => (t.id === id ? { ...t, ...payload } : t));
  notify();
}
