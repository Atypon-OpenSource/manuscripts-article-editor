declare module '@storybook/addon-storyshots'

declare module '*.jpg'

// declare module '*.jpg' {
//   const content: string
//   export default content
// }

// retyping "action" so it can be used in place of ThunkActionCreator
declare module '@storybook/addon-actions' {
  /* tslint:disable-next-line:no-any */
  export const action: any
}
