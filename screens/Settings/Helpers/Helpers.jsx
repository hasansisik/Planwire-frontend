import { View, Platform, StatusBar, SafeAreaView } from "react-native";
import React from "react";
import { AppBar, HeightSpacer, ReusableText } from "../../../components";
import styles from "../../Pages/pages.style";
import ReusableSettings from "../../../components/Reusable/ReusableSettings";
import { COLORS, TEXT } from "../../../constants/theme";
import { Contact, AboutUs } from "../../Data/index";
import { useTranslation } from "react-i18next";

const Helpers = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: COLORS.white },
        { top: Platform.OS === "ios" ? 0 : StatusBar.currentHeight },
      ]}
    >
      <View style={styles.header}>
        <AppBar
          top={20}
          left={20}
          right={20}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReusableText
          text={t("howCanWeHelp")}
          family={"regular"}
          size={TEXT.large}
          color={COLORS.description}
        />
        <ReusableText
          text={t("helpAndSupportCenter")}
          family={"medium"}
          size={TEXT.xLarge}
          color={COLORS.black}
        />
      </View>
      <HeightSpacer height={50} />
      <View style={{ paddingHorizontal: 20, paddingBottom: 5 }}>
        <ReusableText
          text={t("helpAndSupportCenter")}
          family={"regular"}
          size={TEXT.small}
          color={COLORS.description}
        />
      </View>
      <View style={styles.settingsBox}>
        <ReusableSettings
          icon={"information-circle-outline"}
          title={t("aboutUs")}
          onPress={() => {
            navigation.navigate("PoliticyPage", {
              header: t("helpAndSupportCenter"),
              title: t("aboutUs"),
              text: AboutUs,
            });
          }}
        />
        <View style={{ borderTopWidth: 1, borderColor: COLORS.lightBorder }} />
        <ReusableSettings
          icon={"help-circle-outline"}
          title={t("faq")}
          onPress={() => navigation.navigate("HelperFaq")}
        />
        <View style={{ borderTopWidth: 1, borderColor: COLORS.lightBorder }} />
        <ReusableSettings
          icon={"headset-outline"}
          title={t("contactAndSupport")}
          onPress={() => {
            navigation.navigate("PoliticyPage", {
              header: t("helpAndSupportCenter"),
              title: t("contactAndSupport"),
              text: Contact,
            });
          }}
        />
      </View>
      <HeightSpacer height={30} />
    </SafeAreaView>
  );
};

export default Helpers;
