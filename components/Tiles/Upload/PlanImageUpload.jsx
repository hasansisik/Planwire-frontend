import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";

export default function PlanImageUpload({ onUpload }) {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState(t("selectPDFOrImage"));

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri, name, mimeType } = result.assets[0];
        // `uri`, `name`, ve `mimeType`
        setFileName(name);
        onUpload({
          uri,
          name,
          type: mimeType,
        });
      } else {
        Alert.alert("Plan yükleme için ,Dosya seçimi iptal edildi.");
      }
    } catch (error) {
      console.error("Plan yükleme için ,Dosya seçimi iptal edildi :", error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={pickFile}
        style={{
          borderRadius: 10,
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginBottom: 20,
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FCFCFC",
          borderColor: "#DCDCDC",
          borderWidth: 1,
        }}
      >
        <Text>{fileName}</Text>
      </TouchableOpacity>
    </View>
  );
}
