import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../../components/PrimaryButton";
import { FeedNavigation } from "../../util/navigation";
import { StyleSheet, TextInput, View } from "react-native";
import Colors from "../../util/Colors";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { setFeedData } from "../../store/redux/feedSlice";

function FeedScreen() {
  const navigation = useNavigation<FeedNavigation>();
  const feedBackData = useAppSelector((state) => state.feedbackData)
  const dispatch = useAppDispatch()
  function feedNavHandler() {
    navigation.navigate("FeedDetailsScreen", {data: feedBackData});
  }
  function feedTextHandler(text: string){
    dispatch(setFeedData(text))
    console.log(feedBackData)
  }
  return (
    <View>
      <TextInput
        placeholder="Please give us your feedback"
        style={styles.userTextInput}
        onChangeText={feedTextHandler}
      ></TextInput>
      <PrimaryButton onPress={feedNavHandler}>Feed Details</PrimaryButton>
    </View>
  );
}

export default FeedScreen;

const styles = StyleSheet.create({
    rootScreen: {},
    userTextInput: {
      marginTop: 16,
      borderWidth: 1,
      borderColor: Colors.accent300,
      backgroundColor: Colors.accent300,
      borderRadius: 6,
      color: "#120438",
      width: "100%",
      padding: 8,
    },
    buttonsContainer: {
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "center",
    },
    buttonStyle: {
      flex: 1,
    },
  });