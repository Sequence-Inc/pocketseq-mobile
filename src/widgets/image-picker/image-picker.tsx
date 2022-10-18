import { Touchable } from "../touchable";
import React, { useLayoutEffect, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View, Text, Modal } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

async function pickFromCamera(
  onResult: (result: ImagePicker.ImagePickerResult) => void,
  onFinished: () => void,
  aspectRatio: [number, number] = [4, 3]
) {
  let permission = await ImagePicker.requestCameraPermissionsAsync();
  if (permission.granted) {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
      });
      onResult(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log(permission);
  }
  onFinished();
}

async function pickFromGallery(
  onResult: (result: ImagePicker.ImagePickerResult) => void,
  onFinished: () => void,
  aspectRatio: [number, number] = [4, 3]
) {
  let permission = await ImagePicker.requestCameraPermissionsAsync();
  if (permission.granted) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
      });
      onResult(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log(permission);
  }
  onFinished();
}

type Props = {
  onResult: (result: ImagePicker.ImagePickerResult) => void;
  onFinished: () => void;
  aspectRatio?: [number, number];
};

const ImageChooser: React.FC<Props> = ({
  onResult,
  onFinished,
  aspectRatio,
}) => {
  useLayoutEffect(() => {}, []);

  return (
    <Modal>
      <View style={styles.rbContainer}>
        <View style={styles.rbSheetHeader}>
          <Text style={styles.rbSheetHeaderTitle}>Image Chooser</Text>
        </View>
        <View style={styles.rbChoiceContainer}>
          <Touchable
            onPress={() => {
              pickFromCamera(onResult, onFinished, aspectRatio);
            }}
          >
            <View style={styles.pickerChoice}>
              <FontAwesome name="camera-retro" size={60} />
              <Text>Take a photo</Text>
            </View>
          </Touchable>
          <Touchable
            onPress={() => {
              pickFromGallery(onResult, onFinished, aspectRatio);
            }}
          >
            <View style={styles.pickerChoice}>
              <MaterialIcons name="photo-library" size={60} />
              <Text>Select from Gallery</Text>
            </View>
          </Touchable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rbContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rbSheetHeader: {
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderBottomWidth: 0.5,
    borderColor: "lightgray",
  },
  rbSheetHeaderTitle: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  rbChoiceContainer: {
    flex: 1,
    flexDirection: "row",
  },
  pickerChoice: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export { pickFromCamera, pickFromGallery, ImageChooser };
