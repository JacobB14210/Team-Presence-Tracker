import { Routes, Route } from "react-router-dom";
import { Login, Home, Time, Calendar } from '../components/component-index';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Time-Off" element={<Time />} />
            <Route path="/Calendar" element={<Calendar />} />
        </Routes>
    );
}

export default App