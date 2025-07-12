const UPDATE_INTERVAL_MS = 60000;

async function fetchIpData() {
  try {
    const response = await fetch('http://ip-api.com/json/?fields=status,message,query,countryCode,city');
    if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
    const data = await response.json();
    if (data.status !== 'success') throw new Error(`API Error: ${data.message}`);
    
    updateActionIcon(data.countryCode);
    
  } catch (error) {
    console.error('Background fetch error for icon:', error);
    updateActionIcon('?');
  }
}

function updateActionIcon(countryCode) {
  const size = 128;
  const canvas = new OffscreenCanvas(size, size);
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, size, size);
  context.fillStyle = '#2c3e50';
  const cornerRadius = 25;
  context.beginPath();
  context.moveTo(cornerRadius, 0);
  context.lineTo(size - cornerRadius, 0);
  context.quadraticCurveTo(size, 0, size, cornerRadius);
  context.lineTo(size, size - cornerRadius);
  context.quadraticCurveTo(size, size, size - cornerRadius, size);
  context.lineTo(cornerRadius, size);
  context.quadraticCurveTo(0, size, 0, size - cornerRadius);
  context.lineTo(0, cornerRadius);
  context.quadraticCurveTo(0, 0, cornerRadius, 0);
  context.closePath();
  context.fill();
  context.fillStyle = '#ecf0f1';
  context.font = `bold ${size * 0.5}px Arial`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(countryCode || '??', size / 2, size / 2 + 5);
  const imageData = context.getImageData(0, 0, size, size);
  chrome.action.setIcon({ imageData: imageData });
}

fetchIpData();
setInterval(fetchIpData, UPDATE_INTERVAL_MS);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateIcon") {
        updateActionIcon(request.countryCode);
    }
});
