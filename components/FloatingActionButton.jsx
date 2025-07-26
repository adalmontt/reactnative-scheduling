import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FloatingActionButton = ({
  onPress,     // optional navigation
  icon = 'add',
  size = 28,
  color = 'white',
  actions = [], // array of { icon, onPress }
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    if (onPress && actions.length === 0) {
      onPress(); // just navigate if no extra actions
    } else {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <View style={styles.container}>
      {expanded &&
        actions.map((action, index) => (
          <Pressable
            key={index}
            style={[styles.option, { bottom: 80 + index * 60 }, {backgroundColor: action.color || '#007bff'}]}
            onPress={() => {
              action.onPress();
              setExpanded(false);
            }}
          >
            <Ionicons name={action.icon} size={24} color="white" />
          </Pressable>
        ))}

      <Pressable style={styles.fab} onPress={toggleExpand}>
        <Ionicons name={expanded ? 'close' : icon} size={size} color={color} />
      </Pressable>
    </View>
  );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 45,
    right: 20,
    alignItems: 'center',
    zIndex: 20,
  },
  fab: {
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  option: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
