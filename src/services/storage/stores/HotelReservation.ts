import { makeObservable, observable, action } from "mobx";

class HotelReservation {
  canUseSubscription = false;

  constructor() {
    makeObservable(this, {
      canUseSubscription: observable,
      setCanUseSubsctiontion: action.bound,
    });
  }

  setCanUseSubsctiontion(val: boolean) {
    this.canUseSubscription = val;
  }
}

export const HotelReservationStore = new HotelReservation();
