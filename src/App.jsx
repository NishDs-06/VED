import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import EventsPage from './pages/EventsPage';
import TeamPage from './pages/TeamPage';

export default function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/team" element={<TeamPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}