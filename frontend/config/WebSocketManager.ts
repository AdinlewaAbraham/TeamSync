import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5001');

socket.connect();

export default socket