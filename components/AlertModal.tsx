import { Modal, View, TouchableOpacity, Text, Platform } from "react-native";
import { ThemedText } from "./ThemedText";
import { ReactNode } from "react";

export default function AlertModal({
  children,
  onClose,
  onConfirm,
  isVisible,
}: {
  children?: ReactNode;
  onClose: Function;
  onConfirm: Function;
  isVisible: boolean;
}) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      visible={isVisible}
    >
      <View
        style={{ backgroundColor: "black", flexGrow: 1, opacity: 0.5 }}
      ></View>
      <View
        style={{
          backgroundColor: "white",
          width: "90%",
          maxWidth: 400,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: 10,
          borderRadius: 16,
        }}
      >
        {children}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={{
              backgroundColor: "transparent",
              height: 32,
              marginTop: 5,
              padding: 2,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              flexGrow: 1,
              borderWidth: 3,
              borderColor: "#79AB57",
            }}
          >
            <Text
              style={{
                color: "#79AB57",
                fontSize: 16,
                textAlign: "center",
                marginTop: Platform.OS === "web" ? 0 : -3,
                fontFamily: "Kanit_500Medium",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onConfirm();
              setTimeout(onClose(), 200);
            }}
            style={{
              backgroundColor: "#79AB57",
              height: 32,
              marginTop: 5,
              padding: 5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              flexGrow: 1,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                textAlign: "center",
                marginTop: Platform.OS === "web" ? 0 : -3,
                fontFamily: "Kanit_500Medium",
              }}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
