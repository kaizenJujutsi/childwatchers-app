import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, ParentTabParamList, WatcherTabParamList } from './types';
import { Colors } from '../theme/colors';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ParentHomeScreen } from '../screens/ParentHomeScreen';
import { FindWatchersScreen } from '../screens/FindWatchersScreen';
import { SOSCenterScreen } from '../screens/SOSCenterScreen';
import { WatcherProfileScreen } from '../screens/WatcherProfileScreen';
import { BookPayScreen } from '../screens/BookPayScreen';
import { AwaitingPaymentScreen } from '../screens/AwaitingPaymentScreen';
import { WatcherHomeScreen } from '../screens/WatcherHomeScreen';
import { WatcherVettingScreen } from '../screens/WatcherVettingScreen';
import { WagesWalletScreen } from '../screens/WagesWalletScreen';
import { ParentVerificationScreen } from '../screens/ParentVerificationScreen';
import { TrainingVideoScreen } from '../screens/TrainingVideoScreen';
import { RateWatcherScreen } from '../screens/RateWatcherScreen';

const Stack = createStackNavigator<RootStackParamList>();
const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const WatcherTab = createBottomTabNavigator<WatcherTabParamList>();


function ParentTabs() {
  return (
    <ParentTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey400,
        tabBarStyle: { borderTopColor: Colors.grey100, backgroundColor: Colors.white },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Home: focused ? 'home' : 'home-outline',
            FindWatchers: focused ? 'search' : 'search-outline',
            SOSCenter: 'warning',
          };
          return <Ionicons name={icons[route.name] as React.ComponentProps<typeof Ionicons>['name']} size={size} color={color} />;
        },
      })}
    >
      <ParentTab.Screen name="Home" component={ParentHomeScreen} options={{ tabBarLabel: 'Home' }} />
      <ParentTab.Screen name="FindWatchers" component={FindWatchersScreen} options={{ tabBarLabel: 'Find' }} />
      <ParentTab.Screen name="SOSCenter" component={SOSCenterScreen} options={{
        tabBarLabel: 'SOS',
        tabBarActiveTintColor: Colors.sos,
      }} />
    </ParentTab.Navigator>
  );
}

function WatcherTabs() {
  return (
    <WatcherTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey400,
        tabBarStyle: { borderTopColor: Colors.grey100, backgroundColor: Colors.white },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            WatcherHome: focused ? 'home' : 'home-outline',
            WagesWallet: focused ? 'wallet' : 'wallet-outline',
            WatcherVetting: focused ? 'shield-checkmark' : 'shield-checkmark-outline',
          };
          return <Ionicons name={icons[route.name] as React.ComponentProps<typeof Ionicons>['name']} size={size} color={color} />;
        },
      })}
    >
      <WatcherTab.Screen name="WatcherHome" component={WatcherHomeScreen} options={{ tabBarLabel: 'Home' }} />
      <WatcherTab.Screen name="WagesWallet" component={WagesWalletScreen} options={{ tabBarLabel: 'Wallet' }} />
      <WatcherTab.Screen name="WatcherVetting" component={WatcherVettingScreen} options={{ tabBarLabel: 'Vetting' }} />
    </WatcherTab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ParentTabs" component={ParentTabs} />
        <Stack.Screen name="WatcherTabs" component={WatcherTabs} />
        <Stack.Screen name="WatcherProfile" component={WatcherProfileScreen} />
        <Stack.Screen name="BookPay" component={BookPayScreen} />
        <Stack.Screen name="AwaitingPayment" component={AwaitingPaymentScreen} />
        <Stack.Screen name="ParentVerification" component={ParentVerificationScreen} />
        <Stack.Screen name="TrainingVideo" component={TrainingVideoScreen} />
        <Stack.Screen name="RateWatcher" component={RateWatcherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
