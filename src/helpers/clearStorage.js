const clearStorage = (reject, resolve) => {
  chrome.storage.local.clear(() => {
    if (chrome.runtime.lastError) {
      console.error("Error clearing local storage:", chrome.runtime.lastError);
      reject(chrome.runtime.lastError);
    } else {
      console.log("Local storage has been cleared.");
      resolve("Translation and storage cleanup successful.");
    }
  });
};

export default clearStorage;
