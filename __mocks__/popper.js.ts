import PopperJs from 'popper.js'

export default class Popper {
  public static placements = PopperJs.placements

  constructor() {
    return {
      destroy: () => {
        // empty
      },
      scheduleUpdate: () => {
        // empty
      },
    }
  }
}
