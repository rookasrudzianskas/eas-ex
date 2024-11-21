//@ts-nocheck
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {Call, CallingState, StreamCall, useStreamVideoClient} from "@stream-io/video-react-native-sdk";
import {useLocalSearchParams} from "expo-router";
import { generateSlug } from "random-word-slugs";
import Toast from "react-native-root-siblings";
import {copySlug} from "@/lib/slugs";

const CallScreen = () => {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let slug: string;

    if(id !== '(call)' && id) {
      // joining the existing call
      slug = id.toString();
      const _call = client?.call("default", slug);
      _call?.join({ create: false }).then(() => {
        setCall(_call);
      });
    } else {
      slug = generateSlug(3, {
        categories: {
          adjective: ['color', 'personality'],
          noun: ['animals', 'food']
        },
      });

      const _call = client?.call("default", slug);
      _call?.join({ create: true }).then(() => {
        // toast popup
        Toast.show('Call created', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          onPress: async () => {
            copySlug(slug);
          }
        });
        setCall(_call);
      })
    }
    setSlug(slug);
  }, [id, client]);

  useEffect(() => {
    if(call?.state.callingState !== CallingState.LEFT) {
      call?.leave();
    }
  }, [call]);

  if(!call || !slug) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <StreamCall call={call}>
      <Room slug={slug} />
    </StreamCall>
  );
};

export default CallScreen;
