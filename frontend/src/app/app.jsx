import { Routes, Route } from "react-router-dom";
import { Login, Time, Calendar, Create} from '../components/component-index';

function App() {
    return (
        <Routes>
            {/* Assign path to each JSX component*/}
            <Route path="/" element={<Login />} />
            <Route path="/Time-Off" element={<Time />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Create" element={<Create />} />
        </Routes>
    );
}

export default App