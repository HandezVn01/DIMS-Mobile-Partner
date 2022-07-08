import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
const Spinning = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3DC5B5" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Spinning
