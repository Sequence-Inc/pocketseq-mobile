import { View, Text, Platform } from "react-native";
import React from "react";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import moment, { Moment } from "moment";
import { useResources } from "../../resources";

export type DatePickerprops = {
  mode: "date" | "time";
  onChange: Function;
  date: Moment | undefined;
  minimumValue?: Date | undefined | Function;
  maximumValue?: Date | undefined | Function;
};

const DatePicker = (props: DatePickerprops) => {
  const [show, setShow] = React.useState(false);
  const { colors } = useResources();

  const mode = "date";
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    props.onChange && props.onChange(moment(currentDate));
    setShow(false);
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: moment(props.date).toDate() || new Date(),
      onChange,
      mode: props.mode,
      is24Hour: true,
    });
  };

  return (
    <View>
      {Platform.OS === "android" && (
        <Text
          onPress={() => showMode()}
          style={{
            fontSize: 16,
            color: colors.textVariant,
            paddingHorizontal: 8,
            paddingVertical: 3,
            backgroundColor: "rgba(0,0,0,0.08)",
            borderRadius: 5,
          }}
        >
          {moment(props?.date || new Date()).format("YYYY年MM月DD日")}
        </Text>
      )}

      {Platform.OS === "ios" && (
        <DateTimePicker
          style={{ flexGrow: 1 }}
          testID="dateTimePicker"
          mode={mode}
          value={moment(props.date).toDate() || moment(new Date()).toDate()}
          is24Hour={true}
          onChange={onChange}
          minimumDate={props.minimumValue}
          maximumDate={props?.maximumValue}
          locale="ja"
        />
      )}
    </View>
  );
};

export default DatePicker;

// style={{
//         flexDirection: "row",
//         justifyContent: "space-between",
//       }}
