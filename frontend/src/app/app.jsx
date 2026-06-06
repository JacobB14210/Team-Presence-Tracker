import { Routes, Route } from "react-router-dom";
import { Login, Home } from '../components/component-index';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
        </Routes>
    );
}

export default App