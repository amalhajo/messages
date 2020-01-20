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

  const handleDelete =(message)=>{
    db.collection("messages").doc(message.id).delete()
  }

  const handleSend=()=>{
    const uid = firebase.auth().currentUser.uid
    if(id){
      console.log("the id",id)
      db.collection("messages").doc(id).update({uid,to,text})
    }
    else{
      db.collection("messages").add(
        {
          from: uid,
          to: to,
          text: text
        }
      )
    }
    setFrom("")
    setId("")
    setText("")
    setTo("")
   
  }

  const handleEdit=(message)=>{
    setFrom(message.from)
    setTo(message.to)
    setText(message.text)
    setId(message.id)

  }
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>

          {
            
            messages.map(message =>
              <View> 
              
              <Text>From:{message.from} </Text>
              <Text>To: {message.to} </Text>
              <Text>Message: {message.text} </Text>
              <Button title="delete" onPress={()=>handleDelete(message)}/>
              <Button title="edit" onPress={()=>handleEdit(message)}/>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '2%'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
