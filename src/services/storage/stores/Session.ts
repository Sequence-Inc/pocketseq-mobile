import { makeObservable, observable, flow, flowResult } from "mobx";
import * as AsyncStorage from "../async-storage";
import { Profile } from "../../domains";
class Session {
  accessToken: string = "";
  refreshToken: string = "";
  profile: Profile | null = {
    id: "",
    email: "",
    emailVerified: false,
    phoneNumber: "",
    name: "",
    nameKana: "",
    firstName: "",
    firstNameKana: "",
    lastName: "",
    lastNameKana: "",
    accountId: "",
    profilePhoto: undefined,
  };

  constructor() {
    makeObservable(this, {
      accessToken: observable,
      refreshToken: observable,
      profile: observable,
      getToken: flow.bound,
      clearToken: flow.bound,
      initializeStore: flow.bound,
      saveLogin: flow.bound,
    });
  }

  *initializeStore() {
    const { accessToken, refreshToken, profile } =
      yield AsyncStorage.getInitialData();

    this.accessToken = accessToken ? JSON.parse(accessToken) : "";
    this.refreshToken = refreshToken ? JSON.parse(refreshToken) : "";
    this.profile = profile ? JSON.parse(profile) : "";
  }

  resetStore() {
    this.accessToken = "";
    this.refreshToken = "";
    this.profile = null;
  }

  *saveLogin({
    accessToken,
    refreshToken,
    profile,
  }: {
    accessToken: string;
    refreshToken: string;
    profile: Profile;
  }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.profile = profile;

    yield AsyncStorage.setKey(AsyncStorage.KEYS.ACCESS_TOKEN, accessToken);
    yield AsyncStorage.setKey(AsyncStorage.KEYS.REFRESH_TOKEN, refreshToken);
    yield AsyncStorage.setKey(AsyncStorage.KEYS.PROFILE, profile);
  }

  getToken() {
    return this.accessToken;
  }

  *clearToken() {
    this.resetStore();
    yield AsyncStorage.clearAll();
  }
}

const SessionStore = new Session();

flowResult(SessionStore.initializeStore());
export default SessionStore;
