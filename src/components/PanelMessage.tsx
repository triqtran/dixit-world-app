import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default function PanelMessage() {
  return (
    <View style={styles.view}>
      <Text>Hello Panel Message</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {alignItems: 'center', justifyContent: 'center'},
});
