import React from 'react';
import { Card, Image, Typography, Space, Tag, Button, Badge, Tooltip } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, StarOutlined, FireOutlined, CrownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductCard = ({ product, onViewDetail, onAddToCart }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateDiscount = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    const discount = calculateDiscount(product.originalPrice, product.price);

    return (
        <Card
            hoverable
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: '16px' }}
            cover={
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <Image
                        alt={product.name}
                        src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                        style={{ 
                            height: 200, 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                        preview={false}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    />
                    
                    {/* Badges */}
                    <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {discount > 0 && (
                            <Badge 
                                count={`-${discount}%`}
                                style={{ 
                                    backgroundColor: '#ff4d4f',
                                    boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)'
                                }}
                            />
                        )}
                        {product.isFeatured && (
                            <Tooltip title="Sản phẩm nổi bật">
                                <CrownOutlined style={{ 
                                    color: '#faad14',
                                    fontSize: '20px',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '50%',
                                    padding: '4px'
                                }} />
                            </Tooltip>
                        )}
                        {product.isOnSale && (
                            <Tooltip title="Đang khuyến mãi">
                                <FireOutlined style={{ 
                                    color: '#ff4d4f',
                                    fontSize: '20px',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '50%',
                                    padding: '4px'
                                }} />
                            </Tooltip>
                        )}
                    </div>
                    
                    {product.stock === 0 && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(2px)'
                        }}>
                            🚫 Hết hàng
                        </div>
                    )}
                </div>
            }
            actions={[
                <Button 
                    type="primary" 
                    icon={<EyeOutlined />} 
                    onClick={() => onViewDetail(product)}
                    block
                    style={{
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                    }}
                >
                    👁️ Xem chi tiết
                </Button>,
                <Button 
                    type="default" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    block
                    style={{
                        borderRadius: '8px',
                        border: '2px solid #f0f0f0',
                        background: product.stock === 0 ? '#f5f5f5' : '#fff',
                        color: product.stock === 0 ? '#999' : '#1890ff'
                    }}
                >
                    🛒 Thêm vào giỏ
                </Button>
            ]}
        >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Title level={5} style={{ 
                    margin: 0, 
                    minHeight: 40,
                    color: '#262626',
                    fontWeight: '600',
                    lineHeight: '1.4'
                }}>
                    {product.name}
                </Title>
                
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                        <Text strong style={{ 
                            fontSize: '18px', 
                            color: '#ff4d4f',
                            fontWeight: 'bold'
                        }}>
                            {formatPrice(product.price)}
                        </Text>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <Text delete style={{ 
                                fontSize: '14px', 
                                color: '#999',
                                textDecoration: 'line-through'
                            }}>
                                {formatPrice(product.originalPrice)}
                            </Text>
                        )}
                    </Space>
                    
                    {product.rating > 0 && (
                        <Space>
                            <StarOutlined style={{ color: '#faad14' }} />
                            <Text style={{ 
                                fontSize: '13px',
                                color: '#666',
                                fontWeight: '500'
                            }}>
                                {product.rating.toFixed(1)} ({product.reviewCount} đánh giá)
                            </Text>
                        </Space>
                    )}
                    
                    <div style={{
                        background: product.stock > 10 ? '#f6ffed' : product.stock > 0 ? '#fff7e6' : '#fff2f0',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${product.stock > 10 ? '#b7eb8f' : product.stock > 0 ? '#ffd591' : '#ffccc7'}`
                    }}>
                        <Text style={{ 
                            fontSize: '12px',
                            color: product.stock > 10 ? '#389e0d' : product.stock > 0 ? '#d46b08' : '#cf1322',
                            fontWeight: '500'
                        }}>
                            📦 Còn lại: {product.stock} sản phẩm
                        </Text>
                    </div>
                    
                    {product.tags && product.tags.length > 0 && (
                        <Space wrap>
                            {product.tags.slice(0, 2).map((tag, index) => (
                                <Tag 
                                    key={index} 
                                    size="small"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
                                        border: '1px solid #91d5ff',
                                        color: '#1890ff'
                                    }}
                                >
                                    #{tag}
                                </Tag>
                            ))}
                        </Space>
                    )}
                </Space>
            </Space>
        </Card>
    );
};

export default ProductCard;


