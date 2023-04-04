import * as murmurhash from 'murmurhash-js';

export function generateUniqueHash(input: string): string {
  const hash = murmurhash.murmur3(input, 1); // 第二個參數是種子值，可以任意設置
  return hash.toString(36); // 使用基數 36 進行編碼以縮短哈希值
}

