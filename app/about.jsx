import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';


const About = () => {
  return (
    <View>
      <Text>About</Text>
             <Link href="/" style={{ marginBottom: 20, padding: 10, backgroundColor: '#007bff', borderRadius: 5 }}>click here to go to Index</Link>
      
    </View>
  )
}

export default About

const styles = StyleSheet.create({})