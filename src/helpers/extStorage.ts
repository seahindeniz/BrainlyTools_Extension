/**
 * @param {string} method - Target of storage name. The get is sync memory, getL is local memory [get, getL, set, setL, remove, removeL]
 */
export default function storage(
  method: string,
  data: string | string[] | { [x: string]: any },
) {
  const marketKey = window.System.data.meta.storageKey;
  const action = "storage";
  const messageData = {
    marketKey,
    // action,
    method,
    data,
    local: false,
  };

  if (method.slice(-1) === "L") {
    messageData.method = method.slice(0, -1);
    messageData.local = true;
  }

  return System.toBackground(action, messageData);
  /* if (ext.storage)
  	return ext.runtime.sendMessage(messageData);
  else
  	return ext.runtime.sendMessage(System.data.meta.extension.id, messageData); */
}
