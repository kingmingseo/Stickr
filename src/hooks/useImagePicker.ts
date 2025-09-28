// src/hooks/useImagePicker.ts
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';

export const useImagePicker = () => {
  const pickImage = (type: 'camera' | 'gallery'): Promise<string | null> => {
    return new Promise(resolve => {
      const options = {
        mediaType: 'photo' as MediaType,
        quality: 0.8 as PhotoQuality,
        includeBase64: false,
      };

      const callback = (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          resolve(response.assets[0].uri || null);
        } else {
          resolve(null);
        }
      };

      if (type === 'camera') {
        launchCamera(options, callback);
      } else {
        launchImageLibrary(options, callback);
      }
    });
  };

  return { pickImage };
};
