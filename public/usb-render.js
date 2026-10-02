function getDeviceDetails(device) {
  return device.productName || `Unknown Device ${device.deviceId}`;
}

async function testIt() {
  const noDeviceFoundMsg = 'No USB device found';
  const grantedDevice = await navigator.usb.getDevices();
  let grantedDeviceList = '';
  if (grantedDevice.length > 0) {
    for (const device of grantedDevice) {
      grantedDeviceList += `${getDeviceDetails(device)}\n`;
    }
  } else {
    grantedDeviceList = noDeviceFoundMsg;
  }

  const grantedDeviceListElement = document.getElementById('granted-device-list');
  grantedDeviceListElement.innerHTML = grantedDeviceList;

  grantedDeviceList = '';

  try {
    const grantDevice = await navigator.usb.requestDevice({ filters: [] });
    grantedDeviceList += `${getDeviceDetails(grantDevice)}\n`;
  } catch (error) {
    if (error.name !== 'NotFoundError') {
      grantedDeviceList = noDeviceFoundMsg;
    }
  }
  document.getElementById('requested-device').innerHTML = grantedDeviceList;
}

document.getElementById('request-device-button').addEventListener('click', testIt);
