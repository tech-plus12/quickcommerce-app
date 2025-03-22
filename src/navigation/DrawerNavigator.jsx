import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import { HomeIcon, XMarkIcon, ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from "react-native-heroicons/outline";
import MyAccountScreen from "../screens/MyAccountScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const dispatch = useDispatch();
  const menuItems = [
    {
      name: "MainTabs",
      label: "Home",
      icon: HomeIcon,
    },
    {
      name: "MyAccount",
      label: "My Account",
      icon: UserCircleIcon,
    },
    {
      name: "Settings",
      label: "Settings",
      icon: Cog6ToothIcon,
    },
    {
      name: "Support",
      label: "Help & Support",
      icon: QuestionMarkCircleIcon,
    },
  ];

  return (
    <View style={styles.drawerContent}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.userAvatar} />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.closeDrawer()}>
          <XMarkIcon size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate(item.name);
              navigation.closeDrawer();
            }}
          >
            <item.icon size={24} color="#666666" />
            <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          // Handle logout
          dispatch(logout());
          navigation.closeDrawer();
        }}
      >
        <ArrowRightOnRectangleIcon size={24} color="#FF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerNavigator = () => {
  const menuItems = [
    {
      name: "MainTabs",
      label: "Home",
      icon: HomeIcon,
      component: BottomTabNavigator,
    },
    {
      name: "MyAccount",
      label: "My Account",
      icon: UserCircleIcon,
      component: MyAccountScreen,
    },
    {
      name: "Settings",
      label: "Settings",
      icon: Cog6ToothIcon,
      component: SettingsScreen,
    },
    {
      name: "Support",
      label: "Help & Support",
      icon: QuestionMarkCircleIcon,
      component: HelpSupportScreen,
    },
  ];

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2874f0",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: 320,
        },
        drawerActiveTintColor: "#2874f0",
        drawerInactiveTintColor: "#333333",
      }}
    >
      {menuItems.map((item) => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            title: item.label,
            headerTitle: item.label === "Home" ? "PlusCart" : item.label,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  drawerHeader: {
    backgroundColor: "#2874f0",
    padding: 16,
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  userTextContainer: {
    marginLeft: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333333",
  },
  logoutButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#FF4444",
    fontWeight: "500",
  },
});

export default DrawerNavigator;
