import React from "react";
import { ViewStyle, ScrollView } from "react-native";

type PickerProps = {
  items: any[];
  onSelect: (data: any) => void;
  selectedItem: any;
  renderItem: (item: any, selectedItem: any, onSelect: (data: any) => void) => React.FC<any>;
  containerStyle: ViewStyle;
};

const Picker: React.FC<PickerProps> = ({ items, onSelect, selectedItem, renderItem, containerStyle }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={containerStyle}>
      {items.map((item) => {
        return <>{renderItem(item, selectedItem, onSelect)}</>;
      })}
    </ScrollView>
  );
};

export default Picker;
