import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import UtilsScreen from '../screens/UtilsScreen';
import SyncScreen from '../screens/SyncScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Survey',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          // ? `ios-information-circle${focused ? '' : '-outline'}`
          ? `ios-create`
          : 'md-create'
      }
    />
  ),
};

HomeStack.path = '';

const UtilsStack = createStackNavigator(
  {
    Utils: UtilsScreen,
  },
  config
);

UtilsStack.navigationOptions = {
  tabBarLabel: 'Utilities',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
  ),
};

UtilsStack.path = '';

const SyncStack = createStackNavigator(
  {
    Sync: SyncScreen,
  },
  config
);

SyncStack.navigationOptions = {
  tabBarLabel: 'Sync',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-sync' : 'md-sync'} />
  ),
};

SyncStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  SyncStack,
  UtilsStack
});

tabNavigator.path = '';

export default tabNavigator;
