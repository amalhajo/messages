import * as WebBrowser from 'expo-web-browser';

import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput
} from 'react-native';
import 'firebase/auth'
import { MonoText } from '../components/StyledText';
import db from '../db';
import firebase from '@firebase/app';
import Messages from './Messages'


export default function HomeScreen() {
  const [messages, setMessages] = useState([])
  const [from, setFrom] = React.useState('From');
  const [to, setTo] = React.useState('To');
  const [id, setId] = React.useState("");
  const [text, setText] = React.useState('Text');

  useEffect(() => { 
    db.collection("messages").onSnapshot(querySnapshot => {
      const messages = [];
      querySnapshot.forEach(doc=> {
        messages.push({id:doc.id, ...doc.data()});
      });
      console.log("Current message: ", messages.join(", "))
      setMessages([...messages])
  });
  },[])

  useEffect( ()=>{
    console.log('auth',firebase.auth())
  },[])

  const handleLogin =()=>{
    firebase.auth().signInWithEmailAndPassword(email, password)
  }


  
  

  const handleLogout=()=>{

  }
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        

          {
            
            messages.map((message,i) =>
              <View> 
              <Message key={i} message={message} />
              </View>
              )
          }
      </ScrollView>
      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text =>setFrom(text)}
      placeholder="from"
      value={from}
    />
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text =>setTo(text)}
      placeholder="to"
      value={to}
    />
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text =>setText(text)}
      placeholder="text"
      value={text}
      
    />
    <Button title="send" onPress={()=>handleSend()}/>
    <Button title="Logout" onPress={()=>handleLogout()}/>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}
