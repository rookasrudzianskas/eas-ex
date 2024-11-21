import {SignedIn, SignedOut, useAuth, useUser} from '@clerk/clerk-expo'
import {Link, useRouter} from 'expo-router'
import {FlatList, Image, Switch, Text, TouchableOpacity, View} from 'react-native'
import {Entypo, Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import Dialog from "react-native-dialog";
import {Call, useStreamVideoClient} from "@stream-io/video-react-native-sdk";
import {formatSlug} from "@/lib/slugs";

export default function IndexScreen() {
  const { user } = useUser()
  const [dialogOpen, setDialogOpen] = useState(false);
  const { signOut } = useAuth();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>([]);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMyCalls, setIsMyCalls] = useState(false);

  const fetchCalls = async () => {
    if(!client || !user) return;

    const { calls } = await client.queryCalls({
      filter_conditions: isMyCalls ? {
        $or: [
          { created_by_user_id: user.id },
          { members: { $in: [user.id]} },
        ],
      } : {},
      sort: [{ field: 'created_at', direction: -1}],
      watch: true,
    });

    const sortedCalls = calls.sort((a, b) => {
      return b.state.participantCount - a.state.participantCount;
    });

    setCalls(sortedCalls);
  }

  useEffect(() => {
    fetchCalls();
  }, [isMyCalls]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCalls();
    setIsRefreshing(false);
  }

  const handleJoinRoom = async (id: string) => {
    router.push(`/(call)/${id}`);
  }

  return (
    <View style={{ paddingVertical: 10 }}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 100,
        }}
        onPress={() => setDialogOpen(true)}>
        <MaterialCommunityIcons name={'exit-run'} size={24} color={'#5F5DEC'} />
      </TouchableOpacity>

      <Dialog.Container visible={dialogOpen}>
        <Dialog.Title>Sign Out</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to sign out?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button label="Sign Out" onPress={async () => {
          await signOut();
          setDialogOpen(false);
        }} />
      </Dialog.Container>

      <View
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 10}}
      >
        <Text style={{
          color: isMyCalls ? 'black' : '#5F5DEC'
        }} onPress={() => setIsMyCalls(false)}>
          All Calls
        </Text>
        <Switch
          trackColor={{ false: "#5F5DEC", true: "#5F5DEC" }}
          thumbColor={'white'}
          ios_backgroundColor="#5F5DEC"
          onValueChange={() => setIsMyCalls(!isMyCalls)}
          value={isMyCalls}
        />
        <Text style={{
          color: !isMyCalls ? 'black' : '#5F5DEC'
        }} onPress={() => setIsMyCalls(true)}>
          My Calls
        </Text>
      </View>

      <FlatList
        data={calls}
        keyExtractor={(call) => call.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity key={item.id} onPress={() => handleJoinRoom(item.id)} disabled={item.state.participantCount === 0} style={{
              padding: 20,
              backgroundColor: item.state.participantCount === zIndex ? "#f1f1f1" : "#fff",
              opacity: item.state.participantCount === 0 ? 0.5 : 1,
              borderBottomWidth: 1,
              borderBottomColor: item.state.participantCount === 0 ? "#fff" : "#f1f1f1",
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
              {item.state.participantCount === 0 ? (
                <Feather name={'phone-off'} size={24} color={'gray'} />
              ) : (
                <Feather name={'phone-call'} size={20} color={'gray'} />
              )}

              <Image
                source={{ uri: item.state.createdBy?.image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />

              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.state.createdBy?.name || item.state.createdBy?.custom.email.split('@')[0]}</Text>
                    <Text style={{ fontSize: 12}}>{item.state.createdBy?.custom.email}</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 50}}>
                    <Text style={{ fontSize: 10, textAlign: 'center', width: 100}}>
                      {formatSlug(item.id)}
                    </Text>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      {item.state.participantCount === 0 ? (
                        <Text style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          color: '#5F5DEC'
                        }}>
                          Call Ended
                        </Text>
                      ) : (
                        <View style={{ borderRadius: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', padding: 10}}>
                          <Entypo name={'users'} size={14} color={'#5F5DEC'} style={{ marginRight: 5}} />
                          <Text style={{ color: '#5F5DEC',fontWeight: 'bold' }}>
                            {item.state.participantCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <Text>{item.id}</Text>
            </TouchableOpacity>
          )
        }}
      />

      <SignedIn>
        <Text>You are signed in</Text>
      </SignedIn>
    </View>
  )
}
