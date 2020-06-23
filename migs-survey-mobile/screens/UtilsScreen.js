import React, { useState } from 'react';
import { insertEntry, fetchEntries, deleteAllEntries } from '../helpers/db';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  Modal
} from 'react-native';



export default function UtilsScreen() {


const [itemModalVisible, setItemModalVisible] = useState(false);


  const onDeleteConfirmButtonPress = (event) => {
    async function eraseAllEntriesOnDb() {
      try {
        const dbResult = await deleteAllEntries()
        console.log(dbResult);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    eraseAllEntriesOnDb();
    setItemModalVisible(false);
  }

  const onDeleteModalOpen = () => {
    setItemModalVisible(true);
  }

  


  return (

    <View style={styles.container}>
      <View>
        <Button title="Delete All Entries on this Device" onPress={() => onDeleteModalOpen()}></Button>
        <Text style={styles.note}>Note: Deleting entries on this device does not effect any data stored on the online database.</Text>
      </View>

      <Modal visible={itemModalVisible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.title}>Are you sure you want to DELETE ALL ENTRIES Stored on this Device?</Text>
          <Button title="Yes" style={styles.importantButton} onPress={() => onDeleteConfirmButtonPress()}></Button>
          <Button title="No" style={styles.importantButton} onPress={() => setItemModalVisible(false)}></Button>
        </View>
      </Modal>
    </View>
  );
}

UtilsScreen.navigationOptions = {
  title: 'Utilities',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    margin: 30,
    justifyContent: 'center',
    textAlign: 'center',
  },
  note: {
    margin: 30,
    justifyContent: 'center',
    textAlign: 'center',
  },
  importantButton: {
    margin: 50
  }
});
