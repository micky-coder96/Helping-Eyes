// services/uploadService.ts
/*import {Asset} from 'react-native-image-picker';
import axios from 'axios';
import {Platform} from 'react-native';

export const pickImage = async (): Promise<Asset | null> => {
  // Your implementation
  return null;
};

export const takePhoto = async (): Promise<Asset | null> => {
  // Your implementation
  return null;
};

export const uploadImage = async (image: Asset, uploadUrl: string) => {
  if (!image || !image.uri) {
    throw new Error('No image selected');
  }

  const formData = new FormData();
  const file = {
    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
    type: image.type || 'image/jpeg',
    name: image.fileName || `photo_${Date.now()}.jpg`,
  };

  formData.append('image', file as any);

  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};*/

// services/uploadService.ts

/*import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import axios from 'axios';
import {Platform} from 'react-native';

// 📍 CHANGE THIS TO YOUR PC IP
const API_URL = 'http://192.168.1.4:5000/api/detect';

// 📷 TAKE PHOTO
export const takePhoto = async (): Promise<Asset | null> => {
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
    saveToPhotos: true,
  });

  if (result.didCancel) {
    return null;
  }

  if (result.errorCode) {
    throw new Error(result.errorMessage || 'Camera error');
  }

  return result.assets?.[0] || null;
};

// 🖼 PICK IMAGE FROM GALLERY
export const pickImage = async (): Promise<Asset | null> => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });

  if (result.didCancel) {
    return null;
  }

  if (result.errorCode) {
    throw new Error(result.errorMessage || 'Gallery error');
  }

  return result.assets?.[0] || null;
};

// 📤 UPLOAD IMAGE TO BACKEND
export const uploadImage = async (image: Asset) => {
  if (!image || !image.uri) {
    throw new Error('No image selected');
  }

  const formData = new FormData();

  const file = {
    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,

    type: image.type || 'image/jpeg',

    name: image.fileName || `photo_${Date.now()}.jpg`,
  };

  formData.append('image', file as any);

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};*/
/*import axios from 'axios';
import {Platform} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

// 📷 OPEN CAMERA
export const takePhoto = async (): Promise<Asset | null> => {
  try {
    console.log('Opening camera...');

    const result = await launchCamera({
      mediaType: 'photo',

      quality: 0.8,

      saveToPhotos: true,
    });

    console.log('Camera Result:', result);

    if (result.didCancel) {
      console.log('User cancelled camera');

      return null;
    }

    if (result.errorCode) {
      console.log('Camera Error:', result.errorMessage);

      return null;
    }

    if (result.assets && result.assets.length > 0) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.log('Launch Camera Exception:', error);

    return null;
  }
};

// 🖼 OPEN GALLERY
export const pickImage = async (): Promise<Asset | null> => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });

  if (result.didCancel) {
    return null;
  }

  if (result.assets && result.assets.length > 0) {
    return result.assets[0];
  }

  return null;
};


export const uploadImage = async (image: Asset) => {
  try {
    console.log('===== IMAGE DEBUG =====');

    console.log('URI:', image.uri);
    console.log('TYPE:', image.type);
    console.log('NAME:', image.fileName);

    const formData = new FormData();

    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || 'photo.jpg',
    } as any);

    console.log('Sending request to backend...');

    const response = await axios.post(
      'http://192.168.1.8:5000/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },

        timeout: 15000,
      },
    );

    console.log('===== SUCCESS =====');
    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.log('===== AXIOS ERROR =====');

    console.log('MESSAGE:', error.message);

    console.log('FULL ERROR:', error);

    if (error.response) {
      console.log('RESPONSE DATA:', error.response.data);
      console.log('STATUS:', error.response.status);
    }

    throw error;
  }
};*/
import axios from 'axios';
import {Platform} from 'react-native'; // Cleaned up duplicate imports
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

// 📷 OPEN CAMERA
export const takePhoto = async (): Promise<Asset | null> => {
  try {
    console.log('Opening camera...');
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    });

    if (
      result.didCancel ||
      result.errorCode ||
      !result.assets ||
      result.assets.length === 0
    ) {
      return null;
    }
    return result.assets[0];
  } catch (error) {
    console.log('Launch Camera Exception:', error);
    return null;
  }
};

// 🖼 OPEN GALLERY
export const pickImage = async (): Promise<Asset | null> => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });

  if (result.didCancel || !result.assets || result.assets.length === 0) {
    return null;
  }
  return result.assets[0];
};

// 📤 UPLOAD IMAGE TO BACKEND
export const uploadImage = async (image: Asset) => {
  try {
    console.log('===== IMAGE DEBUG =====');
    console.log('Original URI:', image.uri);

    // CRITICAL FIX: Android requires 'file://' prefix for multipart uploads
    let cleanUri = image.uri;
    if (
      Platform.OS === 'android' &&
      cleanUri &&
      !cleanUri.startsWith('file://')
    ) {
      cleanUri = `file://${cleanUri}`;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: cleanUri,
      type: image.type || 'image/jpeg',
      name: image.fileName || 'photo.jpg',
    } as any);

    console.log('Sending request to backend via USB tunnel...');

    // CRITICAL FIX: Switched from IP address to localhost for adb reverse compatibility
    const response = await axios.post(
      'http://192.168.1.12:5000/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      },
    );
    console.log('STATUS:', response.status);
    console.log('DATA:', JSON.stringify(response.data));

    console.log('===== SUCCESS =====');
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log('===== AXIOS ERROR =====');
    console.log(error);
    console.log('MESSAGE:', error.message);
    console.log('CODE:', error.code);

    if (error.response) {
      console.log('STATUS:', error.response.status);
      console.log('DATA:', error.response.data);
      console.log('HEADERS:', error.response.headers);
    } else if (error.request) {
      console.log('REQUEST:', error.request);
    }

    throw error;
  }
};
