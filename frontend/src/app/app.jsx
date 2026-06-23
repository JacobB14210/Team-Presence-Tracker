import { Routes, Route } from "react-router-dom";
import { Login, Time, Calendar } from '../components/component-index';

function App() {
    return (
        <Routes>
            {/* Assign path to each JSX component*/}
            <Route path="/" element={<Login />} />
            <Route path="/Time-Off" element={<Time />} />
            <Route path="/Calendar" element={<Calendar />} />
        </Routes>
    );
}

export default App