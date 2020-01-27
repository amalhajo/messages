import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Platform, StatusBar, StyleSheet, View ,Button, TextInput} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from 'react';
import AppNavigator from "./navigation/AppNavigator";
import * as firebase from '@firebase/app';
import 'firebase/auth';


export default function App(props) {
  const [user, setUser] = useState(null);
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect((() => { 
    return firebase.auth().onAuthStateChanged(setUser)

    }
  ,[]))

  
  const handleRegister =()=>{
    firebase.auth().createUserWithEmailAndPassword(email, password)
  }
  const handleLogout=()=>{
    firebase.auth().signOut()
  }
 

 


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else if (!user) {
    return (
      <View >
       
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          value={email}
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={text => setPassword(text)}
          placeholder="Password"
          value={password}
        />
      
        <Button title="Register" onPress={() => handleRegister()} />
        <Button title="Login" onPress={() => handleLogin()} />
      </View>
    );
  } else {
    console.log("user",user)
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}


