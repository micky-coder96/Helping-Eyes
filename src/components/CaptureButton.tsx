// src/components/CaptureButton.tsx
/*import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CaptureButtonProps {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  onPress,
  title = 'Capture',
  disabled = false,
  isLoading = false,
  variant = 'primary',
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = styles.button;

    if (disabled || isLoading) {
      return {...baseStyle, ...styles.disabled};
    }

    switch (variant) {
      case 'secondary':
        return {...baseStyle, ...styles.secondary};
      case 'danger':
        return {...baseStyle, ...styles.danger};
      default:
        return {...baseStyle, ...styles.primary};
    }
  };

  const getTextStyles = (): TextStyle => {
    if (variant === 'secondary') {
      return styles.secondaryText;
    }
    return styles.buttonText;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}>
      {isLoading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    marginVertical: 8,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  danger: {
    backgroundColor: '#DC2626',
  },
  disabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});*/
// src/components/CaptureButton.tsx - Simple Version
/*
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewProps,
} from 'react-native';

interface CaptureButtonProps extends ViewProps {
  onPress: () => Promise<void>;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: string;
  textStyle?: object;
  backgroundcolour?: string;
  borderRadius?: number;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  onPress,
  title = 'Capture',
  disabled = false,
  isLoading = false,
  variant = 'primary',
}) => {
  // Determine button color based on variant
  const getButtonColor = () => {
    // eslint-disable-next-line curly
    if (disabled || isLoading) return '#9CA3AF';
    switch (variant) {
      case 'secondary':
        return 'transparent';
      case 'danger':
        return '#DC2626';
      default:
        return '#f8f9fa';
    }
  };

  const getTextColor = () => {
    // eslint-disable-next-line curly
    if (variant === 'secondary' && !disabled) return '#2a6eb7';
    return '#410101';
  };

  const getBorder = () => {
    if (variant === 'secondary' && !disabled)
      // eslint-disable-next-line curly
      return {borderWidth: 1, borderColor: '#007AFF'};
    return {};
  };

  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: getButtonColor()}, getBorder()]}
      onPress={onPress}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator color="#f0e5e5" size="small" />
      ) : (
        <Text style={[styles.text, {color: getTextColor()}]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    marginVertical: 9,
  },
  text: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    marginHorizontal: 10,
  },
});

export default CaptureButton;
*/
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewProps,
} from 'react-native';

interface CaptureButtonProps extends ViewProps {
  onPress: () => Promise<void>;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: string;
  textStyle?: object;
  backgroundcolour?: string; // Note: consider renaming to 'backgroundColor' for consistency
  borderRadius?: number;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  onPress,
  title = 'Capture',
  disabled = false,
  isLoading = false,
  variant = 'primary',
  style, // <--- CHANGE 1: Destructure 'style' from props
  ...rest // <--- CHANGE 2: Collect any other ViewProps
}) => {
  const getButtonColor = () => {
    if (disabled || isLoading) {
      return '#9CA3AF';
    }
    switch (variant) {
      case 'secondary':
        return 'transparent';
      case 'danger':
        return '#DC2626';
      default:
        return '#f8f9fa';
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary' && !disabled) {
      return '#2a6eb7';
    }
    return '#410101';
  };

  const getBorder = () => {
    if (variant === 'secondary' && !disabled) {
      return {borderWidth: 1, borderColor: '#007AFF'};
    }
    return {};
  };

  return (
    <TouchableOpacity
      // CHANGE 3: Add 'style' to the end of the array to apply external styles
      style={[
        styles.button,
        {backgroundColor: getButtonColor()},
        getBorder(),
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      {...rest} // CHANGE 4: Spread remaining props (like testID, etc.)
    >
      {isLoading ? (
        <ActivityIndicator color="#f0e5e5" size="small" />
      ) : (
        <Text style={[styles.text, {color: getTextColor()}]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    marginVertical: 9,
  },
  text: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    marginHorizontal: 10,
  },
});

export default CaptureButton;
