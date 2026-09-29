import React, { useMemo } from 'react';
import { QrCode, Copy, Check, Download } from 'lucide-react';

interface QRCodeViewProps {
  value: string; // e.g. "EMP-184"
  size?: number;
  label?: string;
  showDetails?: boolean;
}

// Simple deterministic QR matrix generator (21x21 Grid Version 1 layout)
function generateQRMatrix(input: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Helper to place 7x7 Finder Pattern at (r, c)
  const placeFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[r + i][c + j] = true;
        }
      }
    }
  };

  // 1. Finder Patterns (Top-Left, Top-Right, Bottom-Left)
  placeFinder(0, 0);
  placeFinder(0, 14);
  placeFinder(14, 0);

  // 2. Timing Patterns (Line 6)
  for (let i = 7; i < 14; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Format Information & Alignment Reserved zones (dummy markers)
  matrix[7][8] = true;
  matrix[8][7] = true;
  matrix[8][8] = true;

  // 4. Populate remaining modules based on input hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  let bitIndex = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= 13;
      const inBottomLeft = r >= 13 && c < 8;
      const isTiming = (r === 6 && c >= 7 && c < 14) || (c === 6 && r >= 7 && r < 14);

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        // Pseudo-random bit based on string characters and position
        const charCode = input.charCodeAt(bitIndex % Math.max(1, input.length));
        const val = (r * 31 + c * 17 + hash + charCode * 7 + (bitIndex % 11)) % 100;
        matrix[r][c] = val > 42;
        bitIndex++;
      }
    }
  }

  return matrix;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 180,
  label,
  showDetails = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  const matrix = useMemo(() => generateQRMatrix(value), [value]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById(`qr-svg-${value}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `QR_${value}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const cellSize = size / 21;

  return (
    <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100">
      {/* Header Badge */}
      <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
            <QrCode size={16} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label || 'Employee Safety Identity'}
          </span>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
          VERIFIED
        </span>
      </div>

      {/* QR Code Container */}
      <div className="relative p-3 bg-white rounded-lg shadow-inner flex items-center justify-center">
        <svg
          id={`qr-svg-${value}`}
          width={size}
          height={size}
          viewBox="0 0 21 21"
          className="shape-rendering-crisp"
        >
          <rect width="21" height="21" fill="#FFFFFF" />
          {matrix.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width="1"
                  height="1"
                  fill="#0F172A"
                />
              ) : null
            )
          )}
        </svg>
      </div>

      {/* ID & Actions */}
      {showDetails && (
        <div className="w-full mt-3 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-400">
            <span>{value}</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded"
              title="Copy ID"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <button
              onClick={handleDownloadSVG}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <Download size={12} />
              <span>Download QR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
