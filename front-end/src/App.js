import { io } from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_API_HOST);

function App() {
  return (
    <div className="App">
    </div>
  );
}

export default App;
