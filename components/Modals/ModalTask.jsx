import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import {
  HeightSpacer,
  ReusableButton,
  ReusableInput,
  ReusableText,
} from "../index";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import NoticeMessage from "../Reusable/NoticeMessage";
import { createTask } from "../../redux/actions/taskActions";
import { Dropdown } from "react-native-element-dropdown";
import { getAllUsers } from "../../redux/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import sendNotification from "../../helpers/sendNotification";

export default function ModalTask({
  showFilters,
  setShowFilters,
  projectId,
  onTaskCreated,
}) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const { plans } = useSelector((state) => state.plans);
  const { users } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
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

  const dropdownPlan = plans.map((plan) => ({
    planId: plan._id,
    planName: plan.planName,
  }));

  const dropdownUser = users.map((person) => ({
    userId: person._id,
    userName: person.name,
  }));

  const formik = useFormik({
    initialValues: { taskCategory: "", taskTitle: "", taskDesc: "" },
    onSubmit: async (values) => {
      const taskData = {
        taskDesc: values.taskDesc,
        taskTitle: values.taskTitle,
        taskCategory: values.taskCategory,
        persons: selectedUserId,
        plan: selectedPlanId,
        taskCreator: user._id,
      };
      const actionResult = await dispatch(
        createTask({
          projectId,
          ...taskData,
        })
      );
      if (createTask.fulfilled.match(actionResult)) {
        const userIds = selectedUserId; 
        const message = `Yeni bir görev oluşturuldu: ${values.taskTitle}`;
        await sendNotification(userIds, message);
        setStatus("success");
        setMessage(t("taskCreatedSuccessfully"));
        const taskId = actionResult.payload._id;
        setTaskId(taskId);
        onTaskCreated && onTaskCreated(taskId);
        setTimeout(() => {
          setShowFilters(false);
        }, 1500);
      } else if (createTask.rejected.match(actionResult)) {
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
    >
      <KeyboardAvoidingView
        style={styles.modalView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <AntDesign name="close" size={22} />
        </TouchableOpacity>
        <HeightSpacer height={20} />
        <View>
          <ReusableText
            text={t("createTask")}
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
        {/* Task Topic Input */}
        <HeightSpacer height={15} />
        <View style={{ gap: 5 }}>
          <ReusableText
            text={t("taskSubject")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.black}
          />
          <ReusableInput
            label={t("taskSubject")}
            theme={{ colors: { primary: "black" } }}
            value={formik.values.taskDesc}
            onChangeText={formik.handleChange("taskDesc")}
            touched={formik.touched.taskDesc}
            error={formik.errors.taskDesc}
          />
        </View>
        {/* Task Category Input */}
        <View style={{ gap: 5 }}>
          <ReusableText
            text={t("taskCategory")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.black}
          />
          <ReusableInput
            label={t("taskCategory")}
            theme={{ colors: { primary: "black" } }}
            value={formik.values.taskCategory}
            onChangeText={formik.handleChange("taskCategory")}
            touched={formik.touched.taskCategory}
            error={formik.errors.taskCategory}
          />
        </View>
        {/* Task Title Input */}
        <View style={{ gap: 5 }}>
          <ReusableText
            text={t("taskTitle")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.black}
          />
          <ReusableInput
            label={t("taskTitle")}
            theme={{ colors: { primary: "black" } }}
            value={formik.values.taskTitle}
            onChangeText={formik.handleChange("taskTitle")}
            touched={formik.touched.taskTitle}
            error={formik.errors.taskTitle}
          />
        </View>
        {/* Plan Selected */}
        <View style={{ gap: 5 }}>
          <ReusableText
            text={t("selectPlan")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.black}
          />
          <View
            style={{
              borderBottomColor: "#E5E5E5",
              borderBottomWidth: 1,
              paddingVertical: 5,
            }}
          >
            <Dropdown
              data={dropdownPlan}
              labelField="planName"
              valueField="planId"
              value={selectedPlanId}
              onChange={(item) => {
                setSelectedPlanId(item.planId);
              }}
              placeholder={t("selectPlan")}
            />
          </View>
        </View>
        {/* User Selected */}
        <HeightSpacer height={20} />
        <View style={{ gap: 5 }}>
          <ReusableText
            text={t("selectPerson")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.black}
          />
          <View
            style={{
              borderBottomColor: "#E5E5E5",
              borderBottomWidth: 1,
              paddingVertical: 5,
            }}
          >
            <Dropdown
              data={dropdownUser}
              labelField="userName"
              valueField="userId"
              valueFieldOSI="userO"
              value={selectedUserId}
              onChange={(item) => {
                setSelectedUserId(item.userId);
              }}
              placeholder={t("selectPerson")}
            />
          </View>
        </View>
        <HeightSpacer height={25} />
        <ReusableButton
          btnText={t("createTask")}
          width={SIZES.width - 60}
          height={45}
          borderRadius={SIZES.small}
          backgroundColor={COLORS.orange}
          textColor={COLORS.white}
          textFontSize={TEXT.small}
          textFontFamily={"medium"}
          onPress={formik.handleSubmit}
        />
        {Platform.OS === "ios" && <HeightSpacer height={25} />}
      </KeyboardAvoidingView>
      {status && <NoticeMessage status={status} message={message} />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 30,
    paddingBottom: 20,
  },
});
