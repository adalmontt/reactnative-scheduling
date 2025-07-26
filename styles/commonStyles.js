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
   },
      rowBetweenClose: {
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
   },
   toggleText:{
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    borderBottomWidth: 1,
   }
});
