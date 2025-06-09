import './App.css';
import Header from './components/common/Header.jsx';
import Home from './pages/Home';
import Footer from './components/common/Footer.jsx';
import 'remixicon/fonts/remixicon.css';
import 'boxicons/css/boxicons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (
        <>
            <Header/>
            <Home/>
            <Footer/>
        </>
    );
}

export default App;
