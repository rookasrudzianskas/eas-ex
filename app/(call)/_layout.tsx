//@ts-nocheck
import React from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from "@clerk/clerk-expo";

const CallRoutesLayout = () => {
  const { isSignedIn } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1}}>
      <Tabs screenOptions={({ route }) => ({
        header: () => {},
        tabBarActiveTintColor: '#5F5DEC',
        tabBarStyle: {
          display: route.name === "[id]" ? "none" : "flex"
        },
        tabBarLabelStyle: {
          zIndex: 100,
          paddingBottom: 5,
        }
      })}>
        <Tabs.Screen
          name={'index'}
          options={{
            title: 'All Calls',
            tabBarIcon: ({ color }) => (
              <Ionicons name={'call-outline'} size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name={'join'}
          options={{
            title: 'Join Call',
            headerTitle: 'Enter the Room ID',
            tabBarIcon: ({ color }) => (
              <Ionicons name={'enter-outline'} size={24} color={color} />
            )
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default CallRoutesLayout;
