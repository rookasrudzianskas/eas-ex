import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-siblings';

export const copySlug = async (slug: string | null)  => {
  if(!slug) return;

  await Clipboard.setStringAsync(formatSlug(slug));

  Toast.show('Copied to clipboard', {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
  });
}

export const formatSlug = (slug: string | null) => {
  if(!slug) return;

  return slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const inverseSlug = (slug: string | null) => {
  if(!slug) return;

  return slug.split(' ').map((word) => word.charAt(0).toLowerCase() + word.slice(1)).join('-');
}
