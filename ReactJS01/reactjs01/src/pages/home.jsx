import React, { useContext, useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Spin, Alert, Space, Avatar } from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    AppstoreOutlined,
    ShoppingOutlined,
    StarOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';
import { getAllCategoriesApi, getAllProductsApi } from '../util/apis';
import CategoryCard from '../components/common/CategoryCard';
import ProductCard from '../components/common/ProductCard';

const { Title, Text } = Typography;

const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch categories
            const categoriesResponse = await getAllCategoriesApi();
            if (categoriesResponse && categoriesResponse.EC === 0) {
                setCategories(categoriesResponse.DT?.slice(0, 4) || []);
            }

            // Fetch featured products
            const productsResponse = await getAllProductsApi(1, 8);
            if (productsResponse && productsResponse.EC === 0) {
                setFeaturedProducts(productsResponse.DT?.products?.slice(0, 8) || []);
            }
        } catch (err) {
            console.error('Error fetching home data:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        console.log('Add to cart:', product);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <Text type="secondary">Đang tải dữ liệu...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
            <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                    style={{ maxWidth: '500px' }}
            />
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'var(--background-light)'
        }}>
            {/* Hero Section */}
            <div style={{
                background: 'white',
                padding: 'var(--space-2xl) 0',
                marginBottom: 'var(--space-xl)',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div className="container">
                    <Row justify="center" align="middle">
                        <Col xs={24} md={16} lg={12} style={{ textAlign: 'center' }}>
                            <Title level={1} style={{ 
                                color: 'var(--text-color)', 
                                marginBottom: 'var(--space-md)',
                                fontSize: '24px',
                                fontWeight: '600'
                            }}>
                                Chào mừng đến với ShopApp
                            </Title>
                            <Text style={{ 
                                color: 'var(--text-secondary)',
                                fontSize: '16px',
                                display: 'block',
                                marginBottom: 'var(--space-lg)',
                                lineHeight: '1.5'
                            }}>
                                Khám phá những sản phẩm chất lượng cao với giá cả hợp lý
                            </Text>
                            <Space size="large">
                                <Button 
                                    type="primary" 
                                    size="large"
                                    onClick={() => navigate('/products')}
                                    style={{
                                        height: '40px',
                                        padding: '0 var(--space-lg)'
                                    }}
                                >
                                    Xem sản phẩm
                                    <ArrowRightOutlined style={{ marginLeft: 'var(--space-xs)' }} />
                                </Button>
                                <Button 
                                    size="large"
                                    onClick={() => navigate('/categories')}
                                    style={{
                                        height: '40px',
                                        padding: '0 var(--space-lg)'
                                    }}
                                >
                                    Danh mục
                                </Button>
                            </Space>
                                            </Col>
                                        </Row>
                </div>
            </div>

            <div className="container">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* User Welcome Section */}
                    {auth.isAuthenticated && (
                        <Card style={{
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-light)',
                            background: 'white',
                            marginBottom: 'var(--space-lg)'
                        }}>
                            <Row align="middle" gutter={24}>
                                <Col xs={24} md={16}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                        <Avatar 
                                            size={48} 
                                            style={{ 
                                                background: 'var(--primary-color)',
                                                fontSize: '18px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {auth.user.name?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                        <div>
                                            <Title level={3} style={{ margin: 0, color: 'var(--text-color)' }}>
                                                Xin chào, {auth.user.name}!
                                            </Title>
                                            <Text type="secondary" style={{ fontSize: '14px' }}>
                                                {auth.user.email}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                    <Button 
                                        type="primary" 
                                        size="large"
                                        onClick={() => navigate('/user')}
                                        style={{
                                            height: '40px',
                                            padding: '0 var(--space-lg)'
                                        }}
                                    >
                                        Quản lý tài khoản
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    )}

                {/* Categories Section */}
                {categories.length > 0 && (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: 'var(--space-lg)',
                            flexWrap: 'wrap',
                            gap: 'var(--space-md)'
                        }}>
                            <Title level={2} style={{ margin: 0, color: 'var(--text-color)' }}>
                                Danh mục sản phẩm
                            </Title>
                            <Button 
                                type="link" 
                                onClick={() => navigate('/categories')}
                                style={{
                                    color: 'var(--primary-color)',
                                    fontWeight: '500',
                                    padding: 'var(--space-xs) var(--space-md)',
                                    height: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-xs)'
                                }}
                            >
                                Xem tất cả
                                <ArrowRightOutlined />
                            </Button>
                        </div>
                        
                        <Row gutter={[16, 16]}>
                            {categories.map((category) => (
                                <Col key={category._id} xs={24} sm={12} md={6} lg={6} xl={6}>
                                    <CategoryCard category={category} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* Featured Products Section */}
                {featuredProducts.length > 0 && (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: 'var(--space-lg)',
                            flexWrap: 'wrap',
                            gap: 'var(--space-md)'
                        }}>
                            <Title level={2} style={{ margin: 0, color: 'var(--text-color)' }}>
                                Sản phẩm nổi bật
                            </Title>
                            <Button 
                                type="link" 
                                onClick={() => navigate('/products')}
                                style={{
                                    color: 'var(--primary-color)',
                                    fontWeight: '500',
                                    padding: 'var(--space-xs) var(--space-md)',
                                    height: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-xs)'
                                }}
                            >
                                Xem tất cả
                                <ArrowRightOutlined />
                            </Button>
                        </div>
                        
                        <Row gutter={[16, 16]}>
                            {featuredProducts.map((product) => (
                                <Col key={product._id} xs={24} sm={12} md={8} lg={6} xl={6}>
                                    <ProductCard
                                        product={product}
                                        onViewDetail={handleViewDetail}
                                        onAddToCart={handleAddToCart}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                    {/* Call to Action */}
                    {!auth.isAuthenticated && (
                        <Card style={{
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-light)',
                            background: 'white',
                            textAlign: 'center',
                            padding: 'var(--space-xl)',
                            marginTop: 'var(--space-lg)'
                        }}>
                            <Title level={3} style={{ color: 'var(--text-color)', marginBottom: 'var(--space-md)' }}>
                                Bắt đầu mua sắm ngay hôm nay
                            </Title>
                            <Text style={{ 
                                color: 'var(--text-secondary)',
                                fontSize: '16px',
                                display: 'block',
                                marginBottom: 'var(--space-lg)'
                            }}>
                                Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng
                            </Text>
                            <Space size="large">
                                <Button 
                                    type="primary" 
                                    size="large"
                                    onClick={() => navigate('/login')}
                                    style={{
                                        height: '40px',
                                        padding: '0 var(--space-lg)'
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                                <Button 
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    style={{
                                        height: '40px',
                                        padding: '0 var(--space-lg)'
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </Space>
                        </Card>
                    )}
            </Space>
            </div>
        </div>
    );
};

export default HomePage;