import React from 'react';
import { Card, Image, Typography, Space, Tag, Button, Badge, Tooltip } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, StarOutlined, FireOutlined, CrownOutlined } from '@ant-design/icons';
import { getRandomProductImage } from '../../constants/images';

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
            className="card-fpt"
            style={{
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                background: 'var(--accent-color)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
            }}
            bodyStyle={{ 
                padding: 'var(--space-lg)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}
            cover={
                <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    aspectRatio: '1',
                    background: 'var(--background-light)',
                    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
                }}>
                    <Image
                        alt={product.name}
                        src={product.images?.[0] || getRandomProductImage()}
                        style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: 'var(--radius-lg)',
                            margin: 'var(--space-sm)',
                            width: 'calc(100% - var(--space-md))',
                            height: 'calc(100% - var(--space-md))'
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
                    <div style={{ 
                        position: 'absolute', 
                        top: 'var(--space-sm)', 
                        left: 'var(--space-sm)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'var(--space-xs)',
                        zIndex: 2
                    }}>
                        {discount > 0 && (
                            <Badge 
                                count={`-${discount}%`}
                                className="badge-fpt"
                                style={{ 
                                    backgroundColor: 'var(--error-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            />
                        )}
                        {product.isFeatured && (
                            <Tooltip title="Sản phẩm nổi bật">
                                <div className="badge-fpt" style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'var(--primary-color)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <CrownOutlined style={{ 
                                        color: 'var(--text-white)',
                                        fontSize: '12px'
                                    }} />
                                </div>
                            </Tooltip>
                        )}
                        {product.isOnSale && (
                            <Tooltip title="Đang khuyến mãi">
                                <div className="badge-fpt" style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'var(--error-color)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <FireOutlined style={{ 
                                        color: 'var(--text-white)',
                                        fontSize: '12px'
                                    }} />
                                </div>
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
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: '600',
                            backdropFilter: 'blur(2px)',
                            zIndex: 3
                        }}>
                            Hết hàng
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
                    className="btn-fpt"
                    style={{
                        borderRadius: 'var(--radius-md)',
                        height: '44px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '0 var(--space-lg)',
                        background: 'var(--primary-color)',
                        border: '2px solid var(--primary-color)',
                        color: 'var(--text-white)',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    Xem chi tiết
                </Button>,
                <Button 
                    type="default" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    block
                    className="btn-fpt-outline"
                    style={{
                        borderRadius: 'var(--radius-md)',
                        height: '44px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '0 var(--space-lg)',
                        border: '2px solid var(--primary-color)',
                        background: product.stock === 0 ? 'var(--background-light)' : 'transparent',
                        color: product.stock === 0 ? 'var(--text-light)' : 'var(--primary-color)',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    Thêm vào giỏ
                </Button>
            ]}
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Title level={5} style={{ 
                    margin: 0, 
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--text-color)',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    fontSize: '14px',
                    minHeight: '40px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {product.name}
                </Title>
                
                <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <Space align="baseline">
                        <Text strong style={{ 
                            fontSize: '16px', 
                            color: 'var(--error-color)',
                            fontWeight: '600'
                        }}>
                            {formatPrice(product.price)}
                        </Text>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <Text delete style={{ 
                                fontSize: '12px', 
                                color: 'var(--text-light)'
                            }}>
                                {formatPrice(product.originalPrice)}
                            </Text>
                        )}
                    </Space>
                </div>
                
                {product.rating > 0 && (
                    <div style={{ marginBottom: 'var(--space-sm)' }}>
                        <Space size="small">
                            <StarOutlined style={{ 
                                color: 'var(--warning-color)',
                                fontSize: '12px'
                            }} />
                            <Text style={{ 
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500'
                            }}>
                                {product.rating.toFixed(1)} ({product.reviewCount} đánh giá)
                            </Text>
                        </Space>
                    </div>
                )}
                
                <div className="badge-fpt" style={{
                    background: product.stock > 10 ? 'var(--success-color)' : product.stock > 0 ? 'var(--warning-color)' : 'var(--error-color)',
                    color: 'var(--text-white)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: '700',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 'var(--space-sm)'
                }}>
                    {product.stock > 10 ? 'Còn hàng' : product.stock > 0 ? 'Sắp hết' : 'Hết hàng'} • {product.stock} sản phẩm
                </div>
                
                {product.tags && product.tags.length > 0 && (
                    <div style={{ marginTop: 'auto' }}>
                        <Space wrap size="small">
                            {product.tags.slice(0, 2).map((tag, index) => (
                                <Tag 
                                    key={index} 
                                    size="small"
                                    style={{
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--primary-light)',
                                        border: '1px solid var(--primary-color)',
                                        color: 'var(--primary-color)',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        padding: '1px 6px'
                                    }}
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </Space>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ProductCard;


