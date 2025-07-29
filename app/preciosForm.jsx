import React, { useState } from 'react';
import {
    ScrollView, Button, Alert, View, Text, TextInput,
    StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/InputField';
import RadioGroup from '../components/RadioGroup';
import CustomAlert from '../components/CustomAlert';
import HeaderWithBack from '../components/headerWithBack';
import ModalConfirm from '../components/ModalConfirm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenLayout from '../components/ScreenLayout';
import { GOOGLE_SHEET_ITEMS_URL, GOOGLE_SHEET_PRECIOS_URL } from '../config/config';
import { commonStyles } from '../styles/commonStyles';
import Dropdown from '../components/DropdownField';
import { formatNumberWithDotsInput, removeDots } from '../utils/utils';
import Colors from '../constants/colors';
import { categorias } from '../constants/constants';

const PrecioForm = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [subElementInput, setSubElementInput] = useState('');

    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };


    const createInitialFormData = () => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
        nombre: '',
        categoria: '',
        creado: '',
        modificacion: '',
        usuario_creador: '',
        ultimo_usuario_modificador: '',
        estado: '',
        show: 'true',
        descripcion: '',
        sub_elementos: [], // dynamic packages will be added here
    });

    const [formData, setFormData] = useState(createInitialFormData());



    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addSubElement = () => {
        if (subElementInput.trim() !== '') {
            setFormData(prev => ({
                ...prev,
                sub_elementos: [...prev.sub_elementos, subElementInput.trim()]
            }));
            setSubElementInput('');
        }
    };

    const removeSubElement = (index) => {
        setFormData(prev => ({
            ...prev,
            sub_elementos: prev.sub_elementos.filter((_, i) => i !== index)
        }));
    };


    const handleSubmit = async () => {
        if (!formData.nombre) {
            Alert.alert('Error', 'Completa todos los campos obligatorios con *');
            setShowSaveModal(false);
            return;
        }

        setShowSaveModal(false);
        setLoading(true);

        const cleanData = {
            ...formData,
            creado: new Date().toISOString(),
              precio: removeDots(formData.precio),
            sub_elementos: JSON.stringify(formData.sub_elementos), // 💥 stringify array here
        };

        try {
            const response = await fetch(GOOGLE_SHEET_ITEMS_URL, {
                method: 'POST',
                body: JSON.stringify(cleanData),
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();

            if (result.result === 'created') {
                setFormData(createInitialFormData());
                router.back();
            } else {
                Alert.alert('Error', 'Error al guardar el combo');
            }
        } catch (error) {
            Alert.alert('Error', 'Error al guardar el combo');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenLayout isSpinner={loading}>
            <HeaderWithBack
                title="Agregar Item"
                sideIcon="add-circle-outline"
                sideFunction={() => setShowSaveModal(true)}
                sideTitle="Agregar"
            />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                contentContainerStyle={[commonStyles.container, { paddingBottom: 100 }]}
            >
                <InputField
                    label="Nombre del item"
                    placeholder="Nombre"
                    value={formData.nombre_combo}
                    onChangeText={(text) => handleChange('nombre', text)}
                    isRequired
                />

                <RadioGroup
                    label="Categoría"
                    options={categorias}
                    selectedValue={formData.categoria}
                    onValueChange={(value) => handleChange('categoria', value)}
                    isRequired
                />

                <InputField
                    label="Precio"
                    placeholder="Precio"
                    value={formData.precio}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        const formattedValue = formatNumberWithDotsInput(text);
                        handleChange('precio', formattedValue);
                    }}
                    isRequired
                />

                <InputField
                    label="Descripción"
                    placeholder="Detalles breves del item"
                    value={formData.descripcion}
                    onChangeText={(text) => handleChange('descripcion', text)}
                    numberOfLines={3}
                />


                <Text style={commonStyles.inputLabel}>Sub-elementos</Text>
                <View style={styles.subInputRow}>
                    <TextInput
                        style={styles.subInput}
                        placeholder="Agregar sub-elemento"
                        value={subElementInput}
                        onChangeText={setSubElementInput}
                        onSubmitEditing={addSubElement}
                        returnKeyType="done"
                    />
                    <Button title="Añadir" onPress={addSubElement} />
                </View>

                <View style={styles.chipsContainer}>
                    {formData.sub_elementos.map((item, index) => (
                        <View key={index} style={styles.chip}>
                            <Text style={styles.chipText}>{item}</Text>
                            <Text style={styles.removeBtn} onPress={() => removeSubElement(index)}>✕</Text>
                        </View>
                    ))}
                </View>




            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
            <ModalConfirm
                visible={showSaveModal}
                message="¿Estás seguro que deseas agregar este combo?"
                onCancel={() => setShowSaveModal(false)}
                onConfirm={handleSubmit}
            />
        </ScreenLayout>
    );
};

export default PrecioForm;


const styles = StyleSheet.create({

    subLabel: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
        fontSize: 16,
    },

    subInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    subInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginRight: 10,
    },

    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightBlue,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },

    chipText: {
        marginRight: 6,
    },

    removeBtn: {
        color: '#ff3333',
        fontWeight: 'bold',
    },

})