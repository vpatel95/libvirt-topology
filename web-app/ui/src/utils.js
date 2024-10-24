export function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false; // Object has at least one property
    }
  }
  return true; // Object is empty
}

export const getMemory = (ram) => {
  if (ram < 1024) {
    return ram + ' MB';
  } else if (ram < (1024 * 1024)) {
    return (ram / 1024) + ' GB';
  } else if (ram < 1024 * 1024 * 1024) {
    return (ram / (1024 * 1024)) + ' TB';
  }
}

export const getFlavor = (flavor) => {
  let res = "Unknown";
  switch (flavor) {
    case "pe":
      res = "Provider Edge";
      break;
    case "ce":
      res = "Customer Edge";
      break;
    case "dev":
      res = "Dev Machine";
      break;
    default:
      res = "Unknown";
  }

  return res;
}

export const getNetworkType = (nwType) => {
  let res = "Unknown";
  switch (nwType) {
    case "nat":
      res = "WAN";
      break;
    case "isolated":
      res = "LAN";
      break;
    case "management":
      res = "Management";
      break;
    default:
      res = "Unknown"
  }
  return res;
}

