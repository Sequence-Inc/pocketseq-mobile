import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEYS = {
  TOKEN: "token",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  PROFILE: "profile",
};

export const AsyncStoreUtils = AsyncStorage;
export const getToken = () => get(KEYS.ACCESS_TOKEN);

export const multiSet = (data: any) => AsyncStorage.multiSet(data);
export const setKey = async (key: string, payload: any) => {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    throw new Error(`Could not set ${key} key`);
  }
};

export const get = async (key: string) => {
  try {
    let storedData = await AsyncStorage.getItem(key);
    if (!storedData) {
      return null;
    }
    return storedData != null ? storedData : null;
  } catch (err) {
    throw new Error(`Could not get ${key} key`);
  }
};

export const remove = async (key: string) => {
  try {
    return AsyncStorage.removeItem(key);
  } catch (err) {
    throw new Error(`Could not remove ${key} key`);
  }
};

export const clearAll = async () => {
  try {
    return AsyncStorage.clear();
  } catch (err: unknown) {
    throw new Error("Could not clear storage");
  }
};

export const getInitialData = async () => {
  let refreshToken = await get(KEYS.REFRESH_TOKEN);

  let profile = await get(KEYS.PROFILE);

  let accessToken = await get(KEYS.ACCESS_TOKEN);

  return { accessToken, refreshToken, profile };
};

export const clearInitialData = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(KEYS.PROFILE);
    await AsyncStorage.removeItem(KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(KEYS.TOKEN);
  } catch (err) {
    throw new Error(`Could not clear initial data`);
  }
};
