//@ts-nocheck
import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {useAuth} from "@clerk/clerk-expo";
import {Redirect, Stack} from "expo-router";

const AuthRoutesLayout = () => {
  const { isSignedIn } = useAuth();

  if(isSignedIn) {
    return <Redirect href={'/(call)'} />
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#5F5DEC'}}>
      <Stack>
        <Stack.Screen
          name={'sign-in'}
          options={{
            title: 'Sign In to get started',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'sign-up'}
          options={{
            title: 'Sign Up to get started',
            headerBackTitle: 'Sign In',

            headerStyle: { backgroundColor: '#5F5DEC' },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
    </SafeAreaView>
  );
};

export default AuthRoutesLayout;
