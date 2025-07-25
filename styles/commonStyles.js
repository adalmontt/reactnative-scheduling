import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#f7f7f7',
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
    backgroundColor: '#f7f7f7',
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
   }
});
