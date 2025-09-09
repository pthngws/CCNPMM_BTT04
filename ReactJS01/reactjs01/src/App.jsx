import { useContext, useEffect } from 'react';
import { Layout, Spin, Typography } from 'antd';
import AppHeader from './components/layout/header.jsx';
import { AuthContext } from './components/context/auth.context';
import { Outlet } from 'react-router-dom';
import './styles/search.css';
import './styles/global.css';
import './App.css';

const { Content } = Layout;
const { Text } = Typography;

function App() {
  const { appLoading } = useContext(AuthContext);

  useEffect(() => {
    // fetchUser đã được gọi trong AuthWrapper, không cần gọi lại ở đây
  }, []);

  return (
    <>
      {appLoading === true ? (
        <div className="loading-container" style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          background: 'white',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <Spin size="large" />
          <Text type="secondary" style={{ marginTop: 'var(--space-4)' }}>
            Đang tải ứng dụng...
          </Text>
        </div>
      ) : (
        <Layout style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
          <AppHeader />
          <Content style={{ 
            background: 'transparent',
            minHeight: 'calc(100vh - 64px)'
          }}>
            <Outlet />
          </Content>
        </Layout>
      )}
    </>
  );
}

export default App;