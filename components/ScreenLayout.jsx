import React from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from './Footer';
import { commonStyles } from '../styles/commonStyles';

const ScreenLayout = ({
    children,
    footer = true,
    isSpinner = false,
    style = {},
    contentContainerStyle = {},
    edges = ['bottom', 'left', 'right'],
}) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: '#fff' }, style]} edges={edges}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={[{ flex: 1 }, contentContainerStyle]}>
                    {children}
                </View>
            </KeyboardAvoidingView>
            {footer && (
                <View style={{ paddingBottom: insets.bottom, backgroundColor: '#fff' }}>
                    <Footer />
                </View>
            )}

            {isSpinner && (
                <View style={commonStyles.blockingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

        </SafeAreaView>
    );
};

export default ScreenLayout;