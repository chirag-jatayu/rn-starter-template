import {
  check,
  request,
  openSettings,
  RESULTS,
  Permission,
  PermissionStatus,
  PERMISSIONS,
} from 'react-native-permissions';
import {Platform, Alert} from 'react-native';
import {requestNotifications} from 'react-native-permissions';
/**
 * Utility to show alert when permission is blocked.
 * @param permissionName - Name to show in alert dialog
 */
const showDeniedAlert = (permissionName: string): void => {
  Alert.alert(
    `${permissionName} Permission Denied`,
    `Please enable ${permissionName.toLowerCase()} permission from settings.`,
    [
      {text: 'Open Settings', onPress: () => openSettings()},
      {text: 'Cancel', style: 'cancel'},
    ],
  );
};

/**
 * Handles a permission request with proper result handling.
 * @param permission - Platform-specific permission constant
 * @param permissionName - Human-friendly name for UI
 * @returns true if granted, false otherwise
 */
const handlePermission = async (
  permission: Permission,
  permissionName: string,
): Promise<boolean> => {
  const result: PermissionStatus = await request(permission);

  switch (result) {
    case RESULTS.GRANTED:
      return true;
    case RESULTS.BLOCKED:
      showDeniedAlert(permissionName);
      return false;
    case RESULTS.DENIED:
    case RESULTS.LIMITED:
    case RESULTS.UNAVAILABLE:
    default:
      return false;
  }
};

export const requestLocationPermission = async (): Promise<boolean> => {
  const permission: Permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  return handlePermission(permission, 'Location');
};

export const requestCameraPermission = async (): Promise<boolean> => {
  const permission: Permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  return handlePermission(permission, 'Camera');
};

export const requestMicrophonePermission = async (): Promise<boolean> => {
  const permission: Permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
  return handlePermission(permission, 'Microphone');
};

export const requestStoragePermission = async (): Promise<boolean> => {
  const permission: Permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  return handlePermission(permission, 'Storage');
};

export const requestContactsPermission = async (): Promise<boolean> => {
  const permission: Permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CONTACTS
      : PERMISSIONS.ANDROID.READ_CONTACTS;
  return handlePermission(permission, 'Contacts');
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const {status} = await requestNotifications(['alert', 'sound', 'badge']);
    return status === RESULTS.GRANTED;
  } else {
    // POST_NOTIFICATIONS is available on Android 13+ and may not exist in older versions
    const permission: Permission | undefined = (PERMISSIONS.ANDROID as any)
      .POST_NOTIFICATIONS;
    if (permission) {
      return handlePermission(permission, 'Notifications');
    }
    // If POST_NOTIFICATIONS is not available, assume granted (for older Android versions)
    return true;
  }
};

export const requestBluetoothPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const permission = PERMISSIONS.IOS.BLUETOOTH;
    return handlePermission(permission, 'Bluetooth');
  }
  return true; // Android handles Bluetooth automatically
};
