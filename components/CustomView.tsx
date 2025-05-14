import { Platform, ScrollView, View } from "react-native";

export const CustomView = ({
  type,
  children,
}: {
  type: string;
  children: any;
}) => {
  if (Platform.OS === "web" || type === "search") {
    // for search page
    return <View>{children}</View>;
  }
  return (
    // for home page
    <ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>
      {children}
    </ScrollView>
  );
};

export default CustomView;
