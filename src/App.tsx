import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import AgentPerformance from './pages/AgentPerformance';
import CallHistory from './pages/CallHistory';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/agents" element={<AgentPerformance />} />
          <Route path="/history" element={<CallHistory />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
