if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

import { registerRootComponent } from "expo";
import { activateKeepAwake } from "expo-keep-awake";
import { Application } from "./src/application";

if (__DEV__) activateKeepAwake();

registerRootComponent(Application);
