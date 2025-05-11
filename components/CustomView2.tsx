import { View, Image, Platform } from "react-native";


export const CustomView2 = ({ children, width }: { children: any, width: number }) => {
  if ((Platform.OS === "web") && (width > 600)) {
    return (
      <View
        style={{
          width: "80%",
          maxWidth: 1200,
          alignSelf: "center",
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        {children}
      </View>
    );
  }
  return (
    <View style={{
      display: "flex", flexDirection: "column", gap: 5
    }}>
      {children}
    </View>
  );
};

export default CustomView2