import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, Button, View } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import db from "../db";
import firebase from "@firebase/app";
import "firebase/auth";

export default function LinksScreen() {
  const [allUsers, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");

  const handleSet = async () => {
    // const snap = await db
    //   .collection("users")
    //   .doc(firebase.auth().currentUser.uid)
    //   .get();
    //   console.log("snap", snap)
  };

  const handleUsers = async () => {
    db.collection("users").onSnapshot(querySnapshot => {
      const users = [];
      querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current user: ", users);
      setUsers([...users]);
    });
  };

  const checkFriend = async userToAdd => {
    console.log("here");
    const result = await db
      .collection("friends")
      .where("friend1", "==", loggedInUser);
    console.log("result -------", result);
  };

  const addFriend = async userid => {
    console.log("add friend");
    db.collection("friends").add({ friend1: loggedInUser, friend2: userid });
  };

  useEffect(() => {
    handleUsers();
    setLoggedInUser(firebase.auth().currentUser.uid);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text>M</Text>
      {allUsers.map(u => (
        <View>
          <Text>{u.displayName}</Text>
          <Button title="Add friend" onPress={() => checkFriend(u.id)} />
        </View>
      ))}
      <Text>Logged in user id ::: {loggedInUser}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
