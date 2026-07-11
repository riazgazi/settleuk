// University band lookup helper — extracted from App.js
import { UNI_BANDS_BACHELOR, UNI_BANDS_MASTERS } from '../data/universities';

export function getUniBand(level, gpaOrCgpa) {
  const bands = level === "masters" ? UNI_BANDS_MASTERS : UNI_BANDS_BACHELOR;
  return bands.find(b => gpaOrCgpa >= b.min) || bands[bands.length - 1];
}
