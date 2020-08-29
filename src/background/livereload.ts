import ext from "webextension-polyfill";

const LIVERELOAD_HOST = "localhost";
const LIVERELOAD_PORT = 35729;
const connection = new WebSocket(
  `ws://${LIVERELOAD_HOST}:${LIVERELOAD_PORT}/livereload`,
);

connection.onerror = error => {
  console.error("reload connection got error:", error);
};

connection.onmessage = event => {
  if (!event.data) return;

  const data = JSON.parse(event.data);

  if (!data || data.command !== "reload") return;

  ext.runtime.reload();
};
