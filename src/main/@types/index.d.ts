declare module "growly" {
  declare function notify(message: string, {title: string, icon: string}, callback?: (error: unknown, action: string) => void);
}
