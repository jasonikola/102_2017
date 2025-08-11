type ShowFn = (message: string) => void;

let showFn: ShowFn | null = null;
let queue: string[] = [];

export const ErrorManager = {
  register(fn: ShowFn) {
    showFn = fn;
    queue.forEach((m) => fn(m));
    queue = [];
  },
  unregister() {
    showFn = null;
  },
  show(message: string) {
    if (showFn) {
      showFn(message);
    } else {
      queue.push(message);
    }
  }
};
