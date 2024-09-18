import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import { HeightSpacer, ReusableButton, ReusableText } from "../index";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import NoticeMessage from "../Reusable/NoticeMessage";
import { addPersonToTask } from "../../redux/actions/taskActions";
import { Dropdown } from "react-native-element-dropdown";
import { getAllUsers } from "../../redux/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export default function ModalSelectUser({
  showFilters,
  setShowFilters,
  taskId,
  onUserSelected,
}) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const { users } = useSelector((state) => state.user);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      const companyId = await AsyncStorage.getItem("companyId");
      if (companyId) {
        dispatch(getAllUsers(companyId));
      }
    };
    fetchUsers();
  }, [dispatch]);

  const dropdownUser = users
    ? users.map((person) => ({
        userId: person._id,
        userName: person.name,
      }))
    : [];

  const formik = useFormik({
    initialValues: {
      userId: "",
    },
    onSubmit: async (values) => {
      const actionResult = await dispatch(
        addPersonToTask({
          taskId,
          userId: selectedUserId,
        })
      );
      if (addPersonToTask.fulfilled.match(actionResult)) {
        setStatus("success");
        setMessage(t("userAddedToTaskSuccessfully"));
        onUserSelected(selectedUserName); 
        setTimeout(() => {
          setShowFilters(false);
        }, 1500);
      } else if (addPersonToTask.rejected.match(actionResult)) {
        const errorMessage = actionResult.payload;
        setStatus("error");
        setMessage(errorMessage);
        setTimeout(() => setStatus(null), 2000);
      }
    },
  });

  useEffect(() => {
    if (!showFilters) {
      setStatus(null);
      formik.resetForm();
    }
  }, [showFilters]);

  return (
    <Modal
      isVisible={showFilters}
      onSwipeComplete={() => setShowFilters(false)}
      swipeDirection="down"
      style={{ justifyContent: "flex-end", margin: 0 }}
      statusBarTranslucent={true}
    >
      <View style={styles.modalView}>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <AntDesign name="close" size={22} />
        </TouchableOpacity>
        <HeightSpacer height={25} />
        <View>
          <ReusableText
            text={t("addPersonToTask")}
            family={"medium"}
            size={TEXT.medium}
            color={COLORS.black}
          />
          <ReusableText
            text={t("createTaskPrompt")}
            family={"regular"}
            size={TEXT.xSmall}
            color={COLORS.description}
          />
        </View>
        {/* User Selected */}
        <HeightSpacer height={30} />
        <View style={{ gap: 5 }}>
          <ReusableText
            text={t("selectPerson")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.black}
          />
          <View
            style={{
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            <Dropdown
              data={dropdownUser}
              labelField="userName"
              valueField="userId"
              value={selectedUserId}
              onChange={(item) => {
                setSelectedUserId(item.userId);
                setSelectedUserName(item.userName);
              }}
              placeholder={t("selectPerson")}
            />
          </View>
        </View>
        <HeightSpacer height={50} />
        <ReusableButton
          btnText={t("addPersonToTask")}
          width={SIZES.width - 60}
          height={50}
          borderRadius={SIZES.small}
          backgroundColor={COLORS.orange}
          textColor={COLORS.white}
          textFontSize={TEXT.small}
          textFontFamily={"medium"}
          onPress={formik.handleSubmit}
        />
      </View>
      {status && <NoticeMessage status={status} message={message} />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    paddingBottom: 20,
  },
});
