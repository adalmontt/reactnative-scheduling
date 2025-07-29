import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
    padding: 20,
  },


  title: {
    fontSize: 24,
    // fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'PlayfairDisplayItalic',
  },

  containerCards: {
    flex: 1,
    paddingTop: 50,
    padding: 10,
    backgroundColor: 'white',
  },
  SafeAreaViewStyle: {
    flex: 1,
    backgroundColor: 'white'
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBetweenClose: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',

  },
  toggleText: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    borderBottomWidth: 1,
  },
  blockingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  addButtonContainer: {
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // center horizontally without absolute positioning
    marginVertical: 20,  // spacing from list
  },
});
