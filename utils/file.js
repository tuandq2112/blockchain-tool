export const stringToBlob = (data = "", config = { type: "image/bmp" }) => {
  var bytes = new Uint8Array(data.length / 2);

  for (var i = 0; i < data.length; i += 2) {
    bytes[i / 2] = parseInt(data.substring(i, i + 2), /* base = */ 16);
  }

  // Make a Blob from the bytes
  var blob = new Blob([bytes], config);

  // Use createObjectURL to make a URL for the blob
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
};
