import * as WebBrowser from "expo-web-browser";

import React, { useState, useEffect } from "react";
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
} from "react-native";
import "firebase/auth";
import { MonoText } from "../components/StyledText";
import db from "../db";
import firebase from "@firebase/app";

export default function Messages({ message }) {
  const handleEdit = message => {
    setFrom(message.from);
    setTo(message.to);
    setText(message.text);
    setId(message.id);
  };
  const handleSend = () => {
    const uid = firebase.auth().currentUser.uid;
    if (id) {
      console.log("the id", id);
      db.collection("messages")
        .doc(id)
        .update({ uid, to, text });
    } else {
      db.collection("messages").add({
        from: uid,
        to: to,
        text: text
      });
    }
    setFrom("");
    setId("");
    setText("");
    setTo("");
  };

  const handleDelete = message => {
    db.collection("messages")
      .doc(message.id)
      .delete();
  };

  return (
    <View>
      <Text>From:{message.from} </Text>
      <Text>To: {message.to} </Text>
      <Text>Message: {message.text} </Text>
      <Button title="delete" onPress={() => handleDelete(message)} />
      <Button title="edit" onPress={() => handleEdit(message)} />
    </View>
  );
}
