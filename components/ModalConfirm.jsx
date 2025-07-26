import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const ModalConfirm = ({
  visible,
  message = '¿Estás seguro?',
  onCancel,
  onConfirm,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  confirmColor = 'red',
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            <Button title={cancelText} onPress={onCancel} />
            <Button title={confirmText} color={confirmColor} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfirm;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
