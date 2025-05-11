import { View, Image, Platform } from "react-native";


export const CustomBookView = ({ children, width, image }: { children: any, width: number, image: string }) => {
  if ((Platform.OS === "web") && (width > 600)) {
    return (

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
        }}
      >
        <Image
          source={{
            uri: image,
          }}
          style={{
            width: 200,
            height: 300,
            borderRadius: 8,
          }}
        />
        {children}
      </View>
    );
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
      }}
    >
      <Image
        source={{
          uri: image,
        }}
        style={{
          width: 150,
          height: 225,
          borderRadius: 8,
        }}
      />
      {children}
    </View>
  );
};

export default CustomBookView