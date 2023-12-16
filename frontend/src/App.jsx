import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import CategoryComponent from './CategoryComponent'
import CategoryComponentWithGST from './CategoryComponentWithGST'
import ProductComponent from './ProductComponent'
import ProductTableComponent from './ProductTableComponent'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={CategoryComponent} />
          <Route path="/gst" Component={CategoryComponentWithGST} />
          <Route path="/product" Component={ProductComponent} />
          <Route path="/sale" Component={ProductTableComponent} />
        </Routes>
      </Router>
    </>
  )
}

export default App
