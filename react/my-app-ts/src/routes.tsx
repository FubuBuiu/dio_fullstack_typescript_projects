import { Route, Routes } from "react-router-dom";
import { Account } from "./pages/Account";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";

export function MainRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/account/:id' element={<Account />} />
            <Route path='/account/:id/profile' element={<Profile />} />
        </Routes>
    );
}