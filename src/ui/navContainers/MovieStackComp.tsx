import { MovieStack } from "../../navigation/containers/nativeStack/MovieStack";
import ListingScreen from "../screens/App/Home/Movies/ListingScreen";
import DetailsScreen from "../screens/App/Home/Movies/DetailsScreen";
import Colors from "../../util/Colors";

const MovieStackComp = () => {
  return (
    <MovieStack.Navigator
      screenOptions={{
        title: "",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: Colors.backgroundColor},
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
          color: Colors.titleColor,
        },
        headerShown: false
      }}
    >
      <MovieStack.Screen
        name="ListingScreen"
        component={ListingScreen}
        options={{title: "Movies"}}
      />
      <MovieStack.Screen name="DetailsScreen" component={DetailsScreen} />
    </MovieStack.Navigator>
  );
};

export default MovieStackComp;
