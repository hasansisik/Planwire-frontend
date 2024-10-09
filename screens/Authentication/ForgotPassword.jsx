import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import React, { useState } from "react";
import styles from "./auth.style";
import general from "../../components/general.style";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import {
  AppBar,
  HeightSpacer,
  ReusableButton,
  ReusableInput,
  ReusableText,
} from "../../components";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "../../utils/validation";
import { forgotPassword } from "../../redux/actions/userActions";
import NoticeMessage from "../../components/Reusable/NoticeMessage";
import { useTranslation } from "react-i18next";

const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      const actionResult = await dispatch(forgotPassword(values.email));
      if (forgotPassword.fulfilled.match(actionResult)) {
        navigation.navigate("ResetPassword", { email: values.email });
        setStatus("success");
        setMessage(t("emailSent"));
      } else if (forgotPassword.rejected.match(actionResult)) {
        const NoticeMessage = actionResult.payload;
        setStatus("error");
        setMessage(NoticeMessage);
      }
      setTimeout(() => setStatus(null), 5000);
    },
  });

  return (
    <SafeAreaView
      style={[
        general.container,
        { paddingTop: Platform.OS === "ios" ? 20 : StatusBar.currentHeight },
      ]}
    >
      {/* Content */}
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/projectxwire-e951a.appspot.com/o/background-line.png?alt=media&token=a6b97028-2aa0-46fb-b2ae-6a67d374fe8d",
          }}
          style={{
            position: "absolute",
            width: SIZES.width,
            height: SIZES.height,
            opacity: 0.5,
          }}
          resizeMode="contain"
        />
        <AppBar
          top={15}
          left={20}
          right={20}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
        <HeightSpacer height={50} />
        <View style={{ padding: 20 }}>
          {/* Header */}
          <ReusableText
            text={"Şifremi Unuttum"}
            family={"bold"}
            size={TEXT.xLarge}
            color={COLORS.orange}
          />
          {/* Description */}
          <ReusableText
            text={"Şifrenizi sıfırlamak için mail adresinizi girin."}
            family={"regular"}
            size={TEXT.medium}
            color={COLORS.description}
          />
          <HeightSpacer height={50} />
          <View>
            {/*Mail Input*/}
            <ReusableInput
              label="Email"
              theme={{ colors: { primary: "black" } }}
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              touched={formik.touched.email}
              error={formik.errors.email}
            />
            <HeightSpacer height={25} />
            {/* Reset Button */}
            <ReusableButton
              btnText={"Şifremi Sıfırla"}
              width={SIZES.width - 40}
              height={50}
              borderRadius={SIZES.small}
              backgroundColor={COLORS.orange}
              textColor={COLORS.white}
              textFontSize={TEXT.small}
              textFontFamily={"medium"}
              onPress={formik.handleSubmit}
            />
          </View>
        </View>
      </View>
      {status && <NoticeMessage status={status} message={message} />}
    </SafeAreaView>
  );
};

export default ForgotPassword;
