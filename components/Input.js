import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const Input = ({ label, icon, error, password, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hidePassword, setHidePassword] = React.useState(password);

  return (
    <View style={{ marginBottom: 20 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        { 
          borderColor: error 
            ? COLORS.error 
            : isFocused 
              ? COLORS.primary 
              : COLORS.border 
        }
      ]}>
        <TextInput
          secureTextEntry={hidePassword}
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ color: COLORS.textTitle, flex: 1 }}
          {...props}
        />
        {/* Jika butuh icon mata untuk password bisa ditambahkan di sini nanti */}
      </View>
      
      {error && (
        <Text style={{ marginTop: 7, color: COLORS.error, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.textBody,
  },
  inputContainer: {
    height: 55,
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: SIZES.radius,
  },
});

export default Input;