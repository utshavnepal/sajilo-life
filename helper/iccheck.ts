import * as Network from "expo-network";

export const iccheck = async (callback: (isOnline: boolean) => void) => {
  // INITIAL STATE
  const state = await Network.getNetworkStateAsync();
  callback(!!state.isConnected && !!state.isInternetReachable);

  // LISTENER
  const subscription = Network.addNetworkStateListener((state) => {
    callback(!!state.isConnected && !!state.isInternetReachable);
  });

  return subscription;
};
