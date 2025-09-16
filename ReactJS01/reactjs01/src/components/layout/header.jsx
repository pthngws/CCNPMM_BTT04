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
            height: '80px'
        }}>
            {/* Logo */}
            <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                textDecoration: 'none',
                color: 'var(--text-white)'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--secondary-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'var(--text-white)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    T
                </div>
                <div>
                    <Text style={{
                        color: 'var(--text-white)',
                        fontSize: '20px',
                        fontWeight: '700',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        TPT Shop
                    </Text>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        fontWeight: '400',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Technology Store
                    </Text>
                </div>
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
                items={menuItems.map(item => ({
                    ...item,
                    style: {
                        color: 'var(--text-white)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '14px'
                    }
                }))}
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
                                color: 'var(--text-white)',
                                height: '40px',
                                padding: '0 var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <Avatar size="small" style={{ background: 'var(--secondary-color)' }}>
                                {auth.user.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Text style={{
                                color: 'var(--text-white)',
                                margin: 0,
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '14px'
                            }}>
                                {auth.user.name}
                            </Text>
                        </Button>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        icon={<UserOutlined />}
                        onClick={() => navigate('/login')}
                        className="btn-fpt"
                        style={{
                            background: 'var(--secondary-color)',
                            border: '2px solid var(--secondary-color)',
                            borderRadius: 'var(--radius-md)',
                            height: '40px',
                            padding: '0 var(--space-md)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
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
                    color: 'var(--text-color)'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--primary-color)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'var(--text-white)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        F
                    </div>
                    <div>
                        <Text style={{
                            color: 'var(--text-color)',
                            fontSize: '18px',
                            fontWeight: '700',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            FPT Shop
                        </Text>
                        <Text style={{
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            fontWeight: '400',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Technology Store
                        </Text>
                    </div>
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
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
            borderBottom: '3px solid var(--secondary-color)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: 'var(--shadow-lg)'
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
                        color: 'var(--text-white)'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--secondary-color)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: 'var(--text-white)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            F
                        </div>
                        <div>
                            <Text style={{
                                color: 'var(--text-white)',
                                fontSize: '20px',
                                fontWeight: '700',
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                FPT Shop
                            </Text>
                            <Text style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '12px',
                                fontWeight: '400',
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Technology Store
                            </Text>
                        </div>
                    </Link>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenuVisible(true)}
                        style={{
                            color: 'var(--text-white)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 'var(--radius-md)'
                        }}
                    />
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                title={
                    <div style={{
                        color: 'var(--text-white)',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        FPT Menu
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                width={280}
                styles={{
                    body: { padding: 0 },
                    header: {
                        background: 'var(--primary-color)',
                        borderBottom: '2px solid var(--secondary-color)'
                    }
                }}
            >
                <MobileMenu />
            </Drawer>
        </header>
    );
};

export default Header;