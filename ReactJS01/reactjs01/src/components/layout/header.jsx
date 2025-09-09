import React, { useContext, useState } from 'react';
import { 
    HomeOutlined, 
    UserOutlined, 
    SettingOutlined, 
    AppstoreOutlined, 
    ShoppingOutlined,
    MenuOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { Menu, Button, Drawer, Typography, Avatar, Dropdown } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context.jsx';

const { Item, SubMenu } = Menu;
const { Text } = Typography;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useContext(AuthContext);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: {
                email: "",
                name: ""
            }
        });
        navigate("/login");
        setMobileMenuVisible(false);
    };

    const getCurrentKey = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/categories')) return 'categories';
        if (path.startsWith('/products')) return 'products';
        if (path.startsWith('/user')) return 'user';
        return 'home';
    };

    const userMenuItems = [
        {
            key: 'user',
            label: <Link to="/user">Quản lý tài khoản</Link>,
            icon: <UserOutlined />
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <SettingOutlined />,
            onClick: handleLogout
        }
    ];

    const menuItems = [
        {
            key: 'home',
            label: <Link to="/">Trang chủ</Link>,
            icon: <HomeOutlined />
        },
        {
            key: 'categories',
            label: <Link to="/categories">Danh mục</Link>,
            icon: <AppstoreOutlined />
        },
        {
            key: 'products',
            label: <Link to="/products">Sản phẩm</Link>,
            icon: <ShoppingOutlined />
        }
    ];

    const DesktopMenu = () => (
        <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px'
        }}>
            {/* Logo */}
            <Link to="/" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-sm)',
                textDecoration: 'none',
                color: 'var(--text-color)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--primary-color)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    S
                </div>
                <Text style={{ 
                    color: 'var(--text-color)', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    margin: 0
                }}>
                    ShopApp
                </Text>
            </Link>

            {/* Navigation */}
            <Menu
                mode="horizontal"
                selectedKeys={[getCurrentKey()]}
                style={{
                    background: 'transparent',
                    border: 'none',
                    flex: 1,
                    justifyContent: 'center'
                }}
                items={menuItems}
            />

            {/* User Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                {auth.isAuthenticated ? (
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button
                            type="text"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                color: 'var(--text-color)',
                                height: '40px',
                                padding: '0 var(--space-md)',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--background-light)',
                                border: '1px solid var(--border-light)'
                            }}
                        >
                            <Avatar size="small" style={{ background: 'var(--primary-color)' }}>
                                {auth.user.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Text style={{ color: 'var(--text-color)', margin: 0 }}>
                                {auth.user.name}
                            </Text>
                        </Button>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        icon={<UserOutlined />}
                        onClick={() => navigate('/login')}
                        style={{
                            borderRadius: 'var(--radius-sm)',
                            height: '40px',
                            padding: '0 var(--space-md)'
                        }}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </div>
    );

    const MobileMenu = () => (
        <div style={{ padding: '16px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
            }}>
                <Link to="/" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    textDecoration: 'none',
                    color: 'var(--gray-900)'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        S
                    </div>
                    <Text style={{ 
                        color: 'var(--gray-900)', 
                        fontSize: '18px', 
                        fontWeight: '600',
                        margin: 0
                    }}>
                        ShopApp
                    </Text>
                </Link>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setMobileMenuVisible(false)}
                />
            </div>

            <Menu
                mode="vertical"
                selectedKeys={[getCurrentKey()]}
                style={{ border: 'none' }}
                items={menuItems}
                onClick={() => setMobileMenuVisible(false)}
            />

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' }}>
                {auth.isAuthenticated ? (
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px',
                            padding: '12px',
                            background: 'var(--gray-50)',
                            borderRadius: '8px'
                        }}>
                            <Avatar style={{ background: '#1890ff' }}>
                                {auth.user.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <div>
                                <Text strong style={{ display: 'block' }}>{auth.user.name}</Text>
                                <Text type="secondary" style={{ fontSize: '14px' }}>{auth.user.email}</Text>
                            </div>
                        </div>
                        <Menu
                            mode="vertical"
                            style={{ border: 'none' }}
                            items={userMenuItems}
                            onClick={() => setMobileMenuVisible(false)}
                        />
                    </div>
                ) : (
                    <Button
                        type="primary"
                        icon={<UserOutlined />}
                        onClick={() => {
                            navigate('/login');
                            setMobileMenuVisible(false);
                        }}
                        block
                        style={{
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                            border: 'none',
                            height: '44px'
                        }}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <header style={{
            background: 'white',
            borderBottom: '1px solid var(--border-light)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            {/* Desktop Menu */}
            <div style={{ display: 'none' }} className="desktop-menu">
                <DesktopMenu />
            </div>

            {/* Mobile Menu */}
            <div style={{ display: 'block' }} className="mobile-menu">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-sm) var(--space-md)'
                }}>
                    <Link to="/" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-sm)',
                        textDecoration: 'none',
                        color: 'var(--text-color)'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'var(--primary-color)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            S
                        </div>
                        <Text style={{ 
                            color: 'var(--text-color)', 
                            fontSize: '16px', 
                            fontWeight: '600',
                            margin: 0
                        }}>
                            ShopApp
                        </Text>
                    </Link>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenuVisible(true)}
                        style={{ color: 'var(--text-color)' }}
                    />
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                title={null}
                placement="right"
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                width={280}
                styles={{
                    body: { padding: 0 }
                }}
            >
                <MobileMenu />
            </Drawer>
        </header>
    );
};

export default Header;