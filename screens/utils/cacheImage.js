import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const cacheImage = async (imageUrl, filename) => {
  const fileUri = `${FileSystem.cacheDirectory}${filename}`;

  const metadata = await FileSystem.getInfoAsync(fileUri);
  if (metadata.exists) {
    return fileUri; // already cached
  }

  try {
    const downloaded = await FileSystem.downloadAsync(imageUrl, fileUri);
    return downloaded.uri;
  } catch (err) {
    console.error('Image download failed:', err);
    return imageUrl; // fallback
  }
};
