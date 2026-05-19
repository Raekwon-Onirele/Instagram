// import CSS
import "./App.css"

// import Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// import pages
import Home from "./pages/Home/Home"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"

// import components
import NavBar from "./components/navBar"
import Footer from "./components/Footer"

function App() {

  return (
    <>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
