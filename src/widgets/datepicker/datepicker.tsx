import { View, Text, Platform } from "react-native";
import React from "react";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment, { Moment } from "moment";

export type DatePickerprops = {
  mode: "date" | "time";
  onChange: Function;
  date: Moment | undefined;
  minimumValue?: Date | undefined | Function;
  maximumValue?: Date | undefined | Function;
};

const DatePicker = (props: DatePickerprops) => {
  const mode = "date";
  const [show, setShow] = React.useState(false);

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

  console.log("platform", Platform.OS);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flexGrow: 1,
      }}
    >
      {Platform.OS === "android" && (
        <Text onPress={() => showMode()}>{moment(props?.date || new Date()).format("YYYY-MM-DD")}</Text>
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
        />
      )}
    </View>
  );
};

export default DatePicker;
