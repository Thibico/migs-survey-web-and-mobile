import React, { useState, useEffect } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { SUBMISSION_COLLECTION } from '../constants/fbCollection';
import { MAX_DOCS } from '../constants/MaxDocsPerUpdate';
import NetInfo from '@react-native-community/netinfo';
import { insertEntry, fetchEntries, deleteAllEntries, updateSynced } from '../helpers/db';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  FlatList,
  SafeAreaView,
  Modal
} from 'react-native';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { config } from '../helpers/firebase';


export default function SyncScreen() {


  const [ttlEntries, setTtlEntries] = useState(0);
  const [syncedEntries, setSyncedEntries] = useState(0);
  const [unsyncedEntries, setUnsyncedEntries] = useState(0);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [currentItemDetails, setCurrentItemDetails] = useState("");
  const [writingToDb, setWritingToDb] = useState(false);
  const [connectivity, setConnectivity] = useState(false);


  handleConnectivityChange = () => {
    NetInfo.isConnected.fetch().done((isConnected) => {
      if(isConnected == true) {
        setConnectivity(true);
      } else {
        setConnectivity(false);
      }
    });  
  }
  
  NetInfo.isConnected.addEventListener(
    'connectionChange',
    handleConnectivityChange
  );

  
  
  const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
  
  if (!firebase.apps.length) { 
    firebase.initializeApp(config); 
  }

  const fbCollection = firebase.firestore().collection(SUBMISSION_COLLECTION);


  const getAllDbEntries = (event) => {
    async function getEntries() {
      try {
        const dbResult = await fetchEntries();
        // console.log(dbResult);
        parseDbResults(dbResult.rows._array);
      } catch (err) {
          throw err;
      }
    }

    getEntries();
  }

  function itemSortFunc(a,b) {
    return a.submittime < b.submittime;
  }

  const parseDbResults = (dbResultArray) => {
    const timeStampsAndSynced = dbResultArray
      .filter(entry => entry.synced === 1)
      .sort(itemSortFunc)
    
    const timeStampsAndUnsynced = dbResultArray
      .filter(entry => entry.synced === 0)
      .sort(itemSortFunc)

    setSyncedEntries(timeStampsAndSynced);
    setUnsyncedEntries(timeStampsAndUnsynced);
    setTtlEntries(timeStampsAndUnsynced.concat(timeStampsAndSynced));
  }

  const displayCleanEntry = ( item ) => () => {
    setItemModalVisible(true);
    if (typeof(item.entry) === "undefined")
      setCurrentItemDetails('');
    else {
      const parsedEntry = JSON.parse(typeof(item.entry) === "undefined" ? {} : item.entry);
      var str = '';
      for (var p in parsedEntry) {
        if (parsedEntry.hasOwnProperty(p)) {
          str += p + '\n\n' + parsedEntry[p] + '\n\n------------------------\n\n';
        }
      }
  
      setCurrentItemDetails(str);
    }
  }

  function entryDisplay(entry,onPressFunc) {
    return (
      <TouchableOpacity onPress={onPressFunc}>
        <View style={styles.entry}>
          <Text >{entry.submittime}</Text>
          {
            entry.synced === 1 
              ? <Text style={styles.synced}>Synced</Text> 
              : <Text style={styles.unsynced}>Not Synced</Text>
            }
        </View>  
      </TouchableOpacity> 
    );
  }

  const uploadToFirebase = () => {
    setWritingToDb(true);
    let batch = firebase.firestore().batch();
    let idsToUpdate = [];
    unsyncedEntries.forEach((item,index) => {
      // console.log(index);
      if (index < MAX_DOCS) {
        const r = Math.random().toString(36).substring(7);
        const newId = item.submittime.replace(/[^a-zA-Z0-9 ]/g, "") + r;
        console.log(newId);
        console.log(item.id);
        const parsedEntry = JSON.parse(typeof(item.entry) === "undefined" ? {} : item.entry);
        // console.log(parsedEntry);
        batch.set(fbCollection.doc(newId),parsedEntry);
        idsToUpdate.push(item.id)
      }
      
    })
    try {
      batch.commit()
      .then(() => {
        updateSynced(idsToUpdate)
          .then(
            () => getAllDbEntries()
          )
      })
      .finally(
        () => setWritingToDb(false)
      );    
    }
    catch (ex) {
      console.error('Error: ', ex.message);
      throw ex;
    }
    
  }
  return (
    <View style={styles.container}>
      {/* <Button title="Delete Database Entries" onPress={() => onDeleteButtonPress()} /> */}
      <Button title="Tap Here to Show Entries Stored On Device" onPress={() => getAllDbEntries()} />
      {/* <Text>Entries on Device: {ttlEntries ? ttlEntries.length : 0}</Text>
      <Text>Synced Entries: {syncedEntries ? syncedEntries.length : 0}</Text>
      <Text>Unsynced Entries: {unsyncedEntries ? unsyncedEntries.length : 0}</Text> */}
      <Text style={styles.title}>Entries on Device: {ttlEntries ? ttlEntries.length : 0}
      , Synced Entries: {syncedEntries ? syncedEntries.length : 0}
      , Unsynced Entries: {unsyncedEntries ? unsyncedEntries.length : 0}</Text>
      <Text style={styles.title}>All Entries Stored on Device</Text>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={ttlEntries}
          renderItem={({ item }) => entryDisplay(item,displayCleanEntry(item))}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>
      <Button 
        title="Tap Here to Upload Entries to Online Database" 
        onPress={() => uploadToFirebase()} 
        disabled={(!unsyncedEntries.length || writingToDb || !connectivity) ? true : false}
      />

      <Modal visible={itemModalVisible} animationType="slide">
        <View style={styles.container}>
          <Button title="Hide entry details" onPress={() => setItemModalVisible(false)}></Button>
          <ScrollView>
            <Text>
              {currentItemDetails}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

SyncScreen.navigationOptions = {
  title: 'Sync with Online Database',
};



const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  entry: {
    padding: 10,
    height: 50,
    backgroundColor: '#eef0f0',
    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 3,
  },
  synced: {
    color: 'green'
  },
  unsynced: {
    color: 'red'
  },
  title: {
    fontSize: 14,
    margin: 10,
    justifyContent: 'center',
    textAlign: 'center',
  }

});
