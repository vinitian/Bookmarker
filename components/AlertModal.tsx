import { Modal, View, Pressable, Platform } from "react-native";
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
          <Pressable
            onPress={() => {
              onClose();
            }}
            style={({ pressed }: { pressed: boolean }) => ({
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
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <ThemedText
              type="bold"
              style={{
                color: "#79AB57",
                fontSize: 16,
                textAlign: "center",
                marginTop: Platform.OS === "web" ? 0 : 2,
              }}
            >
              Cancel
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              onConfirm();
              setTimeout(onClose(), 200);
            }}
            style={({ pressed }: { pressed: boolean }) => ({
              backgroundColor: "#79AB57",
              height: 32,
              marginTop: 5,
              padding: 5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              flexGrow: 1,
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <ThemedText
              type="bold"
              style={{
                color: "#fff",
                fontSize: 16,
                textAlign: "center",
                marginTop: Platform.OS === "web" ? 0 : 2,
              }}
            >
              Confirm
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
