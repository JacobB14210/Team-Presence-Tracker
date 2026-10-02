import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Time, Calendar, Create, Approve } from '../components/component-index';

function App() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    console.log(currentUser);

    return (
        <Routes>
            {/* Assign path to each JSX component */}
            <Route
                path="/"
                element={
                    currentUser
                        ? <Navigate to="/Calendar" replace />
                        : <Login />}/>

            {!currentUser ? (
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}/>
            ) : (
                <>
                    <Route path="/Approve" element={<Approve />} />
                    <Route path="/Time-Off" element={<Time />} />
                    <Route path="/Calendar" element={<Calendar />} />
                    <Route path="/Create" element={<Create />} />
                </>
            )}
        </Routes>
    );
}

export default App