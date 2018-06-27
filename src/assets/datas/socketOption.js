import io from 'socket.io-client'

//test url
const socket = io.connect('http://192.168.0.69:5001/data_refresh');

export {
  socket
}