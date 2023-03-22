import { makeObservable, observable, flow } from "mobx";

import { useFetchSubscriptions } from "../../graphql";

class Subscrption {
  sbscriptions = [];
  constructor() {
    makeObservable(this, {
      sbscriptions: observable,
      fetchSubscriptions: flow,
    });
  }

  *fetchSubscriptions() {
    console.log("flow");

    // const { subscription } = useFetchSubscriptions();

    // console.log({ subscription });
  }
}

export const SubscriptionStore = new Subscrption();
