//@ts-nocheck
import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {inverseSlug} from "@/lib/slugs";
import {useStreamVideoClient} from "@stream-io/video-react-native-sdk";
import {useRouter} from "expo-router";
import Toast from "react-native-root-siblings";

const JoinPage = () => {
  const [roomId, setRoomId] = useState('');
  const client = useStreamVideoClient();
  const router = useRouter();
  const handleJoinRoom = () => {
    console.log('joining room', roomId);
    if(!roomId) return;

    const slug = inverseSlug(roomId);
    const call = client?.call("default", slug);

    call?.get().then((callResponse) => {
      console.log('call response', callResponse);
      router.push(`/call/${slug}`);
    }).catch((error) => {
      console.log('error', error);

      Toast.show('Error joining room', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
      });
    });
  }

  return (
    <View style={{flex: 1}}>
      <Text style={{
        padding: 20,
        fontWeight: 'bold'
      }}>
        Enter the Room Name
      </Text>
      <TextInput
        placeholder={'e.g. Black Purple Tiger'}
        value={roomId}
        onChangetext={setRoomId}
        style={{
          padding: 20,
          width: '100%',
          backgroundColor: 'white',
        }}
      />

      <TouchableOpacity
        onPress={handleJoinRoom}
        style={{
          padding: 20,
          backgroundColor: '#5F5DEC',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

      </TouchableOpacity>
    </View>
  );
};

export default JoinPage;
