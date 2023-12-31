export const delay: (ms: number) => Promise<void> = (ms) =>
  new Promise((res) => setTimeout(res, ms));
