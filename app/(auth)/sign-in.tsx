import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import {Text, TextInput, Button, View, Alert, KeyboardAvoidingView, Platform} from 'react-native'
import React from 'react'
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import StyledButton from "@/components/styled-button";
import SignInWithOAuth from "@/components/sign-in-with-o-auth";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.message)
    }
  }, [isLoaded, emailAddress, password])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      style={{ flex: 1, backgroundColor: '#5F5DEC', paddingHorizontal: 20, justifyContent: 'center', gap: 10}}
    >
      <MaterialIcons
        name={'video-chat'}
        size={160}
        color={'white'}
        style={{
          alignSelf: 'center',
          paddingBottom: 20,
        }}
      />
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        style={{ padding: 20, width: '100%', backgroundColor: 'white', borderRadius: 10}}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        style={{ padding: 20, width: '100%', backgroundColor: 'white', borderRadius: 10}}
      />

      <View style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginVertical: 20 }}/>
      <StyledButton title="Sign In" onPress={onSignInPress} />
      <Text style={{
        textAlign: 'center',
        color: 'white'
      }}>
        OR
      </Text>
      <SignInWithOAuth />
      <View style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginVertical: 20 }}/>

      <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white'}}>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            textDecorationLine: 'underline',
          }}>Sign up</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  )
}
