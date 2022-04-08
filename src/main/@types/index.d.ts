declare module "growly" {
  function notify(message: string, {title, icon}: {title: string; icon: string}, callback?: (error: unknown, action: string) => void): void;
}
