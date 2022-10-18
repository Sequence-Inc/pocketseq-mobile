import { computed, makeObservable } from "mobx";
import { StyleSheet, StatusBar, Dimensions } from "react-native";

const statusBarHeight = StatusBar.currentHeight || 0;
const { height } = Dimensions.get("window");

class Styles {
  constructor() {
    makeObservable(this, {
      globalStyles: computed,
    });
  }
  get globalStyles() {
    return StyleSheet.create({
      fullHeight: {
        flex: 1,
        height: height - statusBarHeight,
      },
      viewWrapper: {
        padding: 10,
      },
      noPad: {
        padding: 0,
        margin: 0,
      },
      headerComponent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        padding: 10,
      },

      h1: {
        fontSize: 20,
      },
      p0: {
        padding: 0,
      },
      m0: { margin: 0 },
      pt10: {
        paddingTop: 10,
      },
      p2: {
        padding: 2,
      },
      pb10: {
        paddingBottom: 10,
      },
      pl10: {
        paddingLeft: 10,
      },
      pr10: {
        paddingRight: 10,
      },
      p10: {
        padding: 10,
      },
      mr10: {
        marginRight: 10,
      },
      mb10: {
        marginBottom: 10,
      },
      mt10: {
        marginTop: 10,
      },
      ml10: {
        marginLeft: 10,
      },
      w100: {
        width: "100%",
      },
      h80: {
        height: "80%",
      },
      h100: {
        height: "100%",
      },
      row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      col: {
        flex: 1,
        flexGrow: 1,
      },
      closedDrawer: {
        width: `${(0.7 / 12) * 100}%`,
        maxWidth: `${(0.7 / 12) * 100}%`,
      },
      col_1: {
        width: `${(1 / 12) * 100}%`,
      },
      col_2: {
        width: `${(2 / 12) * 100}%`,
      },
      col_3: {
        width: `${(3 / 12) * 100}%`,
      },
      col_4: {
        width: `${(4 / 12) * 100}%`,
      },
      col_5: {
        width: `${(5 / 12) * 100}%`,
      },
      col_6: {
        width: `${(6 / 12) * 100}%`,
      },
      col_7: {
        width: `${(7 / 12) * 100}%`,
      },
      col_8: {
        width: `${(8 / 12) * 100}%`,
      },
      col_9: {
        width: `${(9 / 12) * 100}%`,
      },
      col_10: {
        width: `${(10 / 12) * 100}%`,
      },
      col_11: {
        width: `${(11 / 12) * 100}%`,
      },
      col_12: {
        width: `${(12 / 12) * 100}%`,
      },
      flexEnd: {
        justifyContent: "flex-end",
      },
      flexStart: {
        justifyContent: "flex-start",
      },

      flex1: {
        flex: 1,
      },
      flexCenter: {
        justifyContent: "center",
        alignItems: "center",
      },
    });
  }
}

export const styleStore = new Styles();
