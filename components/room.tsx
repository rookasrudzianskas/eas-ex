//@ts-nocheck
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {CallContent} from "@stream-io/video-react-native-sdk";
import {useRouter} from "expo-router";
import {copySlug, formatSlug} from "@/lib/slugs";


const Room = ({ slug } : { slug: string }) => {
  const router = useRouter();

  return (
    <View style={{flex: 1}}>
      <View style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 100,
      }}>
        <RoomId slug={slug} />
      </View>
      <GestureHandlerRootView style={{flex: 1}}>
        <CallContent onHangupCallHandler={() => router.back()} />
      </GestureHandlerRootView>
    </View>
  );
};

export default Room;

const RoomId = ({ slug } : { slug: string }) => {
  return (
      <TouchableOpacity
        onPress={() => copySlug(slug)}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{color: 'white'}}>
          Call ID: {formatSlug(slug)}
        </Text>
      </TouchableOpacity>
    );
}
