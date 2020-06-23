import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { insertEntry, fetchEntries } from '../helpers/db';
import { MonoText } from '../components/StyledText';



export default function HomeScreen() {

  onMessage = (event) => {
    async function writeEntryToDb() {
      const entryString = event.nativeEvent.data;
      const entryObject = JSON.parse(entryString);
      console.log( "On Message", entryString );
      setSubmittedQuestionnaire(entryString); 
      try {
        const dbResult = await insertEntry(
          entryString,
          entryObject._submitTimeString,
          0
        );
        console.log(dbResult);
        console.log(dbResult.rows._array);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    writeEntryToDb();

  }

  const [submittedQuestionnaire, setSubmittedQuestionnaire] = useState("Not yet submitted");

  return (
    <View style={styles.mainContainer}>
      <WebView
        source={{ uri: '' }}
        style={styles.webview}
        onMessage={onMessage}
      />
    </View>
  );
}

HomeScreen.navigationOptions = {
  title: 'Fill in Survey',
};

const styles = StyleSheet.create({
  
  mainContainer: {
    marginTop: 0,
    flex: 1,
    backgroundColor: null,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 4,
    backgroundColor: '#fff',
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
