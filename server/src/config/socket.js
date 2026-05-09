/**
 * Socket.io singleton module.
 *
 * Pattern: store the `io` instance here after it is initialised in server.js.
 * Any module (controller, service …) can then call `getIO()` to emit events
 * without needing to import server.js (which would create circular deps).
 */

let io;

/**
 * Called once from server.js after `new Server(httpServer)`.
 * @param {import('socket.io').Server} ioInstance
 */
const init = (ioInstance) => {
  io = ioInstance;
};

/**
 * Returns the initialised Socket.io server instance.
 * Throws early if called before `init()` so bugs surface immediately.
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialised. Call init() first.');
  }
  return io;
};

module.exports = { init, getIO };
