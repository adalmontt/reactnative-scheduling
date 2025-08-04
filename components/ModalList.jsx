import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';

const ModalList = ({ visible, title, items, onSelect, onClose }) => {
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (key, value) => {
        const onlyNumbers = value.replace(/[^0-9]/g, '');
        setQuantities(prev => ({ ...prev, [key]: onlyNumbers }));
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.title}>{title}</Text>

                        <ScrollView style={{ }}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag">

                            {items.map((itemKey) => {
                                const label = itemKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                return (
                                    <View key={itemKey} style={styles.itemRow}>
                                        <Text style={styles.itemLabel}>{label}</Text>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={quantities[itemKey] || ''}
                                            multiline={false}
                                            numberOfLines={1}
                                            onChangeText={(val) => handleQuantityChange(itemKey, val)}
                                        />
                                        <Pressable
                                            style={styles.addButton}
                                            onPress={() => {
                                                const qty = parseInt(quantities[itemKey] || '1', 10);
                                                onSelect(itemKey, qty);
                                                setQuantities({});
                                                onClose();
                                            }}
                                        >
                                            <Text style={styles.addButtonText}>Agregar</Text>
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </ScrollView>

                        <Pressable onPress={onClose} style={styles.cancelButton}>
                            <Text style={{ color: '#007bff' }}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ModalList;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        
        paddingHorizontal: 20,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
          height: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemLabel: {
        flex: 3,
        fontSize: 15,
    },
    input: {
        flex: 1,
        height: 35,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 8,
        marginHorizontal: 8,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        paddingVertical: 0, // ✅ important: avoids unwanted scroll
    },

    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    cancelButton: {
        marginTop: 15,
        alignSelf: 'center',
    },
});
