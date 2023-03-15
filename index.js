import { registerRootComponent } from "expo";
import { activateKeepAwake } from "expo-keep-awake";
import { Application } from "./src/application";
import * as Sentry from "sentry-expo";

if (__DEV__) activateKeepAwake();

Sentry.init({
  dsn: "https://635a9ab5c0854bb5b51fa3f48f1b7c3c@o4504074031661056.ingest.sentry.io/4504074046865408",
  enableInExpoDevelopment: true,
  debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

registerRootComponent(Application);
