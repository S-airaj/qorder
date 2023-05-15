import React from "react";
import { TouchableOpacity, Dimensions, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./Menu";
import Dashboard from "../screens/dashboard/Dashboard";
import store from "../storeData/AuthStore";
import LoadingScreen from "../components/Loader";
import moment from "moment";
import { LoginScreen, RoleScreen } from "../screens/acccount";
import { AddCategoryScreen, CategoryListScreen, EditCategoryScreen } from "../screens/category";
import TableListScreen from "../screens/table/list";
import { ProductListScreen } from "../screens/product/Index";
import { Icon } from "@rneui/themed";
import { COLORS } from "../constant";
import { Button } from "@rneui/base";
import { OrderHistoryListScreen } from "../screens/orderHistory";
import MenuScreenComponent from "../screens/table/menu";
import CartScreenComponent from "../screens/table/cart";
import PaymentScreenComponent from "../screens/payment/payment";

const { width } = Dimensions.get("window");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

interface Props {
}

interface State {
  isLoading: boolean;
  isAuth: boolean;
}

function HomeStack(props: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Dashboard}
        options={{
          title: 'Home',
          headerLeft: () => (
            <TouchableOpacity>
              <Icon name="menu" size={30} style={{ paddingLeft: 15 }}
                onPress={() => props.navigation.openDrawer()} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ProductScreenStack(props: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          title: 'Products',
          headerLeft: () => (
            <TouchableOpacity>
              <Icon name="menu" size={30} style={{ paddingLeft: 15 }}
                onPress={() => props.navigation.openDrawer()} />
            </TouchableOpacity>
          ),

        }}

      />
    </Stack.Navigator>
  );
}


function TableScreenStack(props: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tables"
        component={TableListScreen}
        options={{
          title: 'Tables',
          headerLeft: () => (
            <TouchableOpacity>
              <Icon name="menu" size={30} style={{ paddingLeft: 15 }}
                onPress={() => props.navigation.openDrawer()} />
            </TouchableOpacity>
          ),

        }}
      />
      <Stack.Screen
        name="Menu"
        component={MenuScreenComponent}
        options={{
          title: 'Menu',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreenComponent}
        options={{
          title: 'Cart',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Payments"
        component={PaymentScreenComponent}
        options={{
          title: 'Payments',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function OrderHistoryScreenStack(props: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order History"
        component={OrderHistoryListScreen}
        options={{
          title: 'Order History',
          headerLeft: () => (
            <TouchableOpacity>
              <Icon name="menu" size={30} style={{ paddingLeft: 15 }}
                onPress={() => props.navigation.openDrawer()} />
            </TouchableOpacity>
          ),

        }}
      />
    </Stack.Navigator>
  );
}

function CategoryScreenStack(props: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={CategoryListScreen}
        options={{
          title: 'Categories',
          headerLeft: () => (
            <TouchableOpacity>
              <Icon name="menu" size={30} style={{ paddingLeft: 15 }}
                onPress={() => props.navigation.openDrawer()} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Add Category"
        component={AddCategoryScreen}
        options={{
          title: 'Add',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Edit Category"
        component={EditCategoryScreen}
        options={{
          title: 'Edit',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default class OnboardingStack extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      isAuth: false
    }
  }

  componentDidMount() {
    store.getData('Token').then(res => {
      if (res && res.access_token) {
        var now = new Date();
        var expiryDate = moment(now.getTime() + res.expires_in * 1000).format('DD/MM/YYYY');
        this.setState({ isAuth: true });
        if (moment(now).format('DD/MM/YYYY') === expiryDate) {
          this.setState({ isAuth: false });
        }
        this.setState({ isLoading: false });
      }
      else {
        this.setState({ isLoading: false, isAuth: false });
      }
    });
  }

  render() {
    const { isLoading, isAuth } = this.state;
    if (isLoading) {
      return <LoadingScreen />
    }
    return (
      <Stack.Navigator screenOptions={{ animationEnabled: false, headerShown: false, presentation: "card" }}>
        {!isAuth ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Role" component={RoleScreen} />
            <Stack.Screen name="App" component={AppStack} />
          </>
        ) :
          (
            <>
              <Stack.Screen name="App" component={AppStack} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Role" component={RoleScreen} />
            </>
          )}
      </Stack.Navigator>
    );

  }
}


function AppStack(props: any) {
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Categories" component={CategoryScreenStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Tables" component={TableScreenStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Products" component={ProductScreenStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Order History" component={OrderHistoryScreenStack} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}

