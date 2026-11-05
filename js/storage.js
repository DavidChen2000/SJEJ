// 封裝應用程式的 localStorage 前綴、JSON 解析與讀取失敗預設值。
export function createStorage(storage, prefix = 'sjej_') {
  function readStored(key, fallback) {
    try {
      const value = storage.getItem(`${prefix}${key}`);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStored(key, value) {
    storage.setItem(`${prefix}${key}`, JSON.stringify(value));
  }

  // 舊版 twelve baskets 專案使用相同 localStorage key，避免混用舊資料。
  const legacyPrefix = 'twelveBaskets_';
  if (storage && typeof storage.removeItem === 'function') {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && key.startsWith(legacyPrefix)) {
        storage.removeItem(key);
        index -= 1;
      }
    }
  }

  return { readStored, writeStored };
}