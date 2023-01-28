import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview'

export default function App() {
  return (
    <>
      <View style={styles.container}/>
      <WebView source={{ uri: "http://46.48.59.66:777/"}}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: 'white'
  },
});
