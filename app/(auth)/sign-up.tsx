import * as React from 'react'
import {TextInput, Button, View, Platform, KeyboardAvoidingView, Text, Alert} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import {useState} from "react";
import StyledButton from "@/components/styled-button";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.message)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.message)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#5F5DEC'}}
    >
      {!pendingVerification && (
        <View style={{ gap: 10 }}>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20}}>
            {"Enter your details to sign up"}
          </Text>
          <TextInput
            style={{ padding: 20, width: '100%', backgroundColor: 'white', borderRadius: 10}}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            secureTextEntry={false}
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            style={{ padding: 20, width: '100%', backgroundColor: 'white', borderRadius: 10 }}
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <StyledButton title="Sign Up" onPress={onSignUpPress} />
        </View>
      )}
      {pendingVerification && (
        <>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20}}>
            {"Enter the code sent to your email"}
            </Text>
          <TextInput style={{ padding: 20, width: '100%', backgroundColor: 'white', borderRadius: 10, marginBottom: 10}} value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
          <StyledButton title="Verify Email" onPress={onPressVerify} />
        </>
      )}
    </KeyboardAvoidingView>
  )
}
