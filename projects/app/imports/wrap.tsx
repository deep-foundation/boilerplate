export interface IWrapOptions {
  Component: React.ComponentType<any>;
}

export function wrap(options: IWrapOptions) {
  return options.Component;
}
