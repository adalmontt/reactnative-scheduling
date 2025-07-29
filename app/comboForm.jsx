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
import { GOOGLE_SHEET_PRECIOS_URL } from '../config/config';
import { commonStyles } from '../styles/commonStyles';
import Dropdown from '../components/DropdownField';

const ComboForm = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);

    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const createInitialFormData = () => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
        nombre_combo: '',
        tipo_evento: '',
        creado: '',
        modificacion: '',
        usuario_creador: '',
        ultimo_usuario_modificador: '',
        estado: '',
        show: 'true',
        data: [], // dynamic packages will be added here
    });

    const [formData, setFormData] = useState(createInitialFormData());

    const eventoItems = [
        { label: 'Boda', value: 'Boda' },
        { label: 'Quince', value: 'Quince' },
        { label: 'Cumpleaños', value: 'Cumpleaños' },
        { label: 'UD/UPD', value: 'UD/UPD' },
        { label: 'Otro', value: 'Otro' },
    ];

    const categorias = [
        { label: 'Comida', value: 'comida' },
        { label: 'Bebida', value: 'bebida' },
        { label: 'Decoracion', value: 'decoracion' },
        { label: 'Miscelaneo', value: 'misc' },
        { label: 'otro', value: 'otro' },
    ];

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPackage = () => {
        setFormData(prev => ({
            ...prev,
            data: [
                ...prev.data,
                { name: '', price: '', categoria: '', description: '', subElements: [''] }
            ]
        }));
    };

    const handlePackageChange = (index, field, value) => {
        const updated = [...formData.data];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, data: updated }));
    };

    const handleSubElementChange = (pkgIndex, subIndex, value) => {
        const updated = [...formData.data];
        updated[pkgIndex].subElements[subIndex] = value;
        setFormData(prev => ({ ...prev, data: updated }));
    };

    const addSubElement = (pkgIndex) => {
        const updated = [...formData.data];
        updated[pkgIndex].subElements.push('');
        setFormData(prev => ({ ...prev, data: updated }));
    };

    const removePackage = (index) => {
        const updated = formData.data.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, data: updated }));
    };

    const handleSubmit = async () => {
        if (!formData.nombre_combo || !formData.tipo_evento) {
            Alert.alert('Error', 'Completa todos los campos obligatorios con *');
            setShowSaveModal(false);
            return;
        }

        setShowSaveModal(false);
        setLoading(true);

        const cleanData = {
            ...formData,
            creado: new Date().toISOString(),
            data: JSON.stringify(formData.data), // 💥 stringify array here
        };

        try {
            const response = await fetch(GOOGLE_SHEET_PRECIOS_URL, {
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
                title="Agregar Combo"
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
                    label="Nombre del combo"
                    placeholder="Nombre"
                    value={formData.nombre_combo}
                    onChangeText={(text) => handleChange('nombre_combo', text)}
                    isRequired
                />

                <RadioGroup
                    label="Categoría"
                    options={eventoItems}
                    selectedValue={formData.tipo_evento}
                    onValueChange={(value) => handleChange('tipo_evento', value)}
                    isRequired
                />

                <Button title="Agregar Elemento" onPress={handleAddPackage} />

                {formData.data.map((pkg, index) => (
                    <View key={index} style={styles.packageBox}>
                        <InputField
                            label={`Nombre del elemento #${index + 1}`}
                            value={pkg.name}
                            onChangeText={(text) => handlePackageChange(index, 'name', text)}
                        />
                        <Dropdown
                            label='Categoria'
                            items={categorias}
                            onValueChange={(value) => handlePackageChange(index, 'categoria', value)}
                        />
                        <InputField
                            label="Precio"
                            value={String(pkg.price)}
                            keyboardType="numeric"
                            onChangeText={(text) => handlePackageChange(index, 'price', text)}
                        />
                        <InputField
                            label="Descripción"
                            value={pkg.description}
                            onChangeText={(text) => handlePackageChange(index, 'description', text)}
                        />

                        <Text style={styles.subTitle}>Sub-elementos</Text>
                        {pkg.subElements.map((sub, i) => (
                            <TextInput
                                key={i}
                                style={styles.subInput}
                                placeholder={`Sub-elemento ${i + 1}`}
                                value={sub}
                                onChangeText={(text) => handleSubElementChange(index, i, text)}
                            />
                        ))}
                        <Button title="+ Sub-elemento" onPress={() => addSubElement(index)} />
                        <Button title="Eliminar paquete" onPress={() => removePackage(index)} color="red" />
                    </View>
                ))}
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

export default ComboForm;

const styles = StyleSheet.create({
    packageBox: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    subTitle: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    subInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
    },
});
