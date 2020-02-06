import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button, Image } from "react-native";
import firebase from "@firebase/app";
import "firebase/auth";
import db from "../db";
import { messaging } from "firebase";
import * as ImagePicker from "expo-image-picker";
import "firebase/storage";
import MapView , {Marker} from "react-native-maps";

export default function SettingsScreen() {
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uri, setUri] = useState("");
  const [region, setRegion] = useState("");
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  const [locations , setLocations] = useState([]);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await ImagePicker.getCameraRollPermissionsAsync();
      setHasCameraRollPermission(status == true);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log("image picker", result);
    if (!result.cancelled) {
      //console.log("not cancelled ", JSON.stringify(response));
      setUri(result.uri);
    }
  };

  const handleSet = async () => {
    const snap = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    setDisplayName(snap.data().displayName);
    setPhotoURL(snap.data().photoURL);
  };

  const handleLocations = async()=>{
    db.collection("users").onSnapshot(querySnapshot => {
      const locations = [];
      querySnapshot.forEach(doc => {
        locations.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current location: ", locations);
      setLocations([...locations]);
    });
  }
  useEffect(() => {
    handleSet();
    handleLocations()
  }, []);

  const handleSave = async () => {
    if (uri !== "") {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const putResult = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .put(blob);

      const url = await firebase
        .storage()
        .ref()
        .child(firebase.auth().currentUser.uid)
        .getDownloadRL();
      console.log("download url", url);
      setPhotoURL(url);
    }
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        displayName: displayName,
        photoURL: photoURL,
        longitude: region.longitude,
        latitude: region.latitude
      });
  };
  return (
    <View style={styles.container}>
      {photoURL !== "" && (
        <Image style={{ width: 50, height: 50 }} source={{ uri: photoURL }} />
      )}

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setDisplayName}
        placeholder="Display Name"
        value={displayName}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setPhotoURL}
        placeholder="Photo URL"
        value={photoURL}
      />
      <Button title="Save" onPress={() => handleSave()}></Button>
      <Button title="Pick an Image" onPress={() => handlePickImage()}></Button>

      <MapView
        style={{ flex: 1 }}
        onRegionChange={r =>
          setRegion(r) || console.log("region :::", region.longitude)
          //setLatit(r.latitude) || setlong(r.long)
        } >
      {
        locations.map( l =>
          l.latitude ? 
          <Marker coordinate={{
            latitude : l.latitude,
            longitude : l.longitude
          }}><Text>{l.displayName}</Text>
          </Marker>
          :
          null
          )
      }
      </MapView>
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: "Settings"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 24,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
