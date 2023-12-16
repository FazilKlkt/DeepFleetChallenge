// Importing necessary modules and components
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

// Main App component
function App() {
  return (
    <>
      {/* Setting up the router for navigation */}
      <Router>
        <Routes>
          {/* Route for the default category component */}
          <Route path="/" Component={CategoryComponent} />
          {/* Route for the category component with GST */}
          <Route path="/gst" Component={CategoryComponentWithGST} />
          {/* Route for the product component */}
          <Route path="/product" Component={ProductComponent} />
          {/* Route for the product table component */}
          <Route path="/sale" Component={ProductTableComponent} />
        </Routes>
      </Router>
    </>
  )
}

// Exporting the App component as the default export
export default App
