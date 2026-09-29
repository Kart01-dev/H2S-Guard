export async function generateSha256(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple deterministic FNV-1a 32-bit hash hex fallback for non-web environments
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const hex = (h >>> 0).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}

export async function generateAuditHash(action: string, entityId: string, userId: string, timestamp: string): Promise<string> {
  const payload = [action, entityId, userId, timestamp].join('|');
  const fullHash = await generateSha256(payload);
  return `sha256:${fullHash.slice(0, 4)}...${fullHash.slice(-4)}`;
}

export async function verifyHash(data: string, expectedHash: string): Promise<boolean> {
  const fullHash = await generateSha256(data);
  const expectedFormat = `sha256:${fullHash.slice(0, 4)}...${fullHash.slice(-4)}`;
  return expectedFormat === expectedHash;
}
