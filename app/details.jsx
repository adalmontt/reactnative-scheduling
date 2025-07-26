import { View, Text, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatDate, formatDateDetails, formatNumberWithDots } from '../utils/utils';
import { commonStyles } from '../styles/commonStyles';
import FloatingActionButton from '../components/FloatingActionButton';
import { useState } from 'react';
import ModalConfirm from '../components/ModalConfirm';
import { GOOGLE_SHEET_URL } from '../config/config';
import CustomAlert from '../components/CustomAlert';
import HeaderWithBack from '../components/headerWithBack';
import { SERVICE_LABELS } from '../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_EXPANDED_HEIGHT = 280;
const HEADER_COLLAPSED_HEIGHT = 120;

const Detail = () => {
  const item = useLocalSearchParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isHiding, setIsHiding] = useState(false);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };


  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsHiding(true);
    const body = {
      id: item.id,
      show: 'false',
    };

    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.result === 'updated') {
        showAlert('Evento Eliminado', 'Evento eliminado correctamente.');
        router.back();
      } else {
        showAlert('Error', 'No se pudo ocultar el evento.');
      }
    } catch (error) {
      console.error('Error al ocultar:', error);
      showAlert('Error', 'No se pudo ocultar el evento.');
    }
  };



  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust if you have header/navbar
      >

        <HeaderWithBack
          title="Detalle de Evento"
        />
        <ScrollView
          contentContainerStyle={[commonStyles.container, { paddingBottom: 40 }]} // add padding bottom
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.overview}>


            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.dataWhite}>{formatDateDetails(item.fecha)}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.dataWhite}>{item.cliente}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Evento:</Text>
              <Text style={styles.dataWhite}>{item.evento}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Monto Total:</Text>
              <Text style={styles.dataWhite}>Gs. {formatNumberWithDots(item.monto_total)}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Cantidad de personas:</Text>
              <Text style={styles.dataWhite}> {item.cantidad_personas}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Pagado:</Text>
              <Text style={styles.dataWhite}> Gs. {formatNumberWithDots(item.pagado)}</Text>
            </View>

          </View>


          <View style={{ marginTop: 30 }}>

            <Text style={styles.secondayTitle}>Descripcion o comentarios</Text>

            <Text style={styles.descripcion}>{item.descripcion != '' ? item.descripcion : "Sin descripcion"}</Text>


            <Text style={styles.secondayTitle}>Servicios Adicionales</Text>


            {Object.entries(SERVICE_LABELS).map(([key, label]) => {
              const value = item[key];
              return (
                <View key={key} style={commonStyles.rowBetweenClose}>
                  <Text style={styles.labelAdditional}>{label}:</Text>
                  <Text style={styles.dataAdditional}>
                    {value === 'true' ? 'Si' : 'No'}
                  </Text>
                </View>
              );
            })}

          </View>


          <ModalConfirm
            visible={showDeleteModal}
            message="¿Estás seguro que deseas eliminar este evento?"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
          <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
          />
          {isHiding && (
            <View style={styles.spinnerOverlay}>
              <ActivityIndicator size="large" color="#007bff" />
            </View>
          )}

        </ScrollView>

        <FloatingActionButton
          icon="grid"
          actions={[
            {
              icon: 'pencil',
              color: 'orange',
              onPress: () => router.push({
                pathname: '/edit',
                params: { item: JSON.stringify(item) }
              })
            }, { icon: 'trash', color: 'red', onPress: () => setShowDeleteModal(true) },
          ]}
        />
      </KeyboardAvoidingView>

    </SafeAreaView>


  );
};

const styles = StyleSheet.create({
  descripcion: {
    fontSize: 16,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  labelAdditional: {
    fontSize: 16,
    marginTop: 10,
  },
  dataWhite: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: 'white',
  },
  dataAdditional: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  secondayTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplayNormal',
    marginBottom: 15,
  },

  overview: {
    backgroundColor: '#007bff',
    padding: 20,
    color: 'white',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,

  },
  value: {
    fontSize: 18,
    color: 'white',
  },
  spinnerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

});

export default Detail;
