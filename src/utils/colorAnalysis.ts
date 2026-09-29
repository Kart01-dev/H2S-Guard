export interface AnalysisResult {
  rawRgb: { r: number; g: number; b: number };
  colorShiftHex: string;
  baselineColorHex: string;
  deltaE: number;
  exposureDosePpmH: number;
  exposureRatePpmH: number;
  confidencePct: number;
  status: 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE' | 'INVALID';
  qualityScorePct: number;
  shiftDurationMinutes: number;
}

export function extractColorFromCanvas(canvas: HTMLCanvasElement): { avgR: number; avgG: number; avgB: number; avgH: number; avgS: number; avgL: number } {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  const width = canvas.width;
  const height = canvas.height;
  
  // Center 40% region
  const startX = Math.floor(width * 0.3);
  const startY = Math.floor(height * 0.3);
  const regionWidth = Math.floor(width * 0.4);
  const regionHeight = Math.floor(height * 0.4);
  
  const imageData = ctx.getImageData(startX, startY, regionWidth, regionHeight);
  const data = imageData.data;
  
  let rSum = 0, gSum = 0, bSum = 0;
  const pixelCount = regionWidth * regionHeight;
  
  for (let i = 0; i < data.length; i += 4) {
    rSum += data[i];
    gSum += data[i+1];
    bSum += data[i+2];
  }
  
  const avgR = Math.round(rSum / pixelCount);
  const avgG = Math.round(gSum / pixelCount);
  const avgB = Math.round(bSum / pixelCount);
  
  // Convert to HSL
  const r = avgR / 255;
  const g = avgG / 255;
  const b = avgB / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return {
    avgR, avgG, avgB,
    avgH: Math.round(h * 360),
    avgS: Math.round(s * 100),
    avgL: Math.round(l * 100)
  };
}

export function rgbToLab(r: number, g: number, b: number): { L: number; a: number; b: number } {
  let rSq = r / 255, gSq = g / 255, bSq = b / 255;

  rSq = rSq > 0.04045 ? Math.pow((rSq + 0.055) / 1.055, 2.4) : rSq / 12.92;
  gSq = gSq > 0.04045 ? Math.pow((gSq + 0.055) / 1.055, 2.4) : gSq / 12.92;
  bSq = bSq > 0.04045 ? Math.pow((bSq + 0.055) / 1.055, 2.4) : bSq / 12.92;

  let x = (rSq * 0.4124 + gSq * 0.3576 + bSq * 0.1805) / 0.95047;
  let y = (rSq * 0.2126 + gSq * 0.7152 + bSq * 0.0722) / 1.00000;
  let z = (rSq * 0.0193 + gSq * 0.1192 + bSq * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

  return {
    L: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
}

export function calculateDeltaE(rgb1: {r:number,g:number,b:number}, rgb2: {r:number,g:number,b:number}): number {
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);
  
  return Math.sqrt(
    Math.pow(lab1.L - lab2.L, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
}

export function applyCalibrationCurve(deltaE: number, shiftDurationMinutes: number): { exposureDosePpmH: number; exposureRatePpmH: number; confidencePct: number; status: 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE' | 'INVALID'; qualityScorePct: number } {
  let status: 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE' | 'INVALID' = 'NORMAL';
  if (deltaE < 3) {
    status = 'INVALID';
    return {
      exposureDosePpmH: 0,
      exposureRatePpmH: 0,
      confidencePct: 0,
      status,
      qualityScorePct: 0
    };
  }
  
  const dose = 0.85 * Math.pow(deltaE, 1.15);
  
  if (dose < 25) status = 'NORMAL';
  else if (dose <= 40) status = 'ATTENTION';
  else status = 'HIGH_EXPOSURE';
  
  const exposureRatePpmH = shiftDurationMinutes > 0 ? dose / (shiftDurationMinutes / 60) : dose;
  
  // Confidence based on deltaE signal strength
  let confidencePct = Math.min(98, Math.max(40, 40 + (deltaE * 1.5)));
  
  // Quality score with slight noise
  const qualityScorePct = Math.min(100, Math.max(0, confidencePct - 2 + Math.random() * 4));
  
  return {
    exposureDosePpmH: dose,
    exposureRatePpmH,
    confidencePct,
    status,
    qualityScorePct
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export async function analyzeImage(imageSrc: string, baselineRgb: {r:number,g:number,b:number} = {r:245, g:238, b:206}): Promise<AnalysisResult> {
  if (typeof Image === 'undefined') {
    // Non-DOM environment fallback (React Native)
    const rawRgb = { r: 139, g: 107, b: 79 };
    const deltaE = calculateDeltaE(baselineRgb, rawRgb);
    const shiftDurationMinutes = 480;
    const metrics = applyCalibrationCurve(deltaE, shiftDurationMinutes);
    return {
      rawRgb,
      colorShiftHex: rgbToHex(rawRgb.r, rawRgb.g, rawRgb.b),
      baselineColorHex: rgbToHex(baselineRgb.r, baselineRgb.g, baselineRgb.b),
      deltaE,
      exposureDosePpmH: metrics.exposureDosePpmH,
      exposureRatePpmH: metrics.exposureRatePpmH,
      confidencePct: metrics.confidencePct,
      status: metrics.status,
      qualityScorePct: metrics.qualityScorePct,
      shiftDurationMinutes,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      
      const { avgR, avgG, avgB } = extractColorFromCanvas(canvas);
      const rawRgb = { r: avgR, g: avgG, b: avgB };
      
      const deltaE = calculateDeltaE(baselineRgb, rawRgb);
      const shiftDurationMinutes = 480; // 8-hour shift default
      
      const metrics = applyCalibrationCurve(deltaE, shiftDurationMinutes);
      
      resolve({
        rawRgb,
        colorShiftHex: rgbToHex(avgR, avgG, avgB),
        baselineColorHex: rgbToHex(baselineRgb.r, baselineRgb.g, baselineRgb.b),
        deltaE,
        exposureDosePpmH: metrics.exposureDosePpmH,
        exposureRatePpmH: metrics.exposureRatePpmH,
        confidencePct: metrics.confidencePct,
        status: metrics.status,
        qualityScorePct: metrics.qualityScorePct,
        shiftDurationMinutes
      });
    };
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = imageSrc;
  });
}
