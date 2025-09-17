import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Image, Typography, Space, Tag, Button, Badge, Tooltip, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, StarOutlined, FireOutlined, CrownOutlined, HeartOutlined, HeartFilled, ShoppingOutlined, MessageOutlined } from '@ant-design/icons';
import { addToFavoritesApi, removeFromFavoritesApi, isFavoriteApi, addToViewedProductsApi } from '../../util/apis';
import { useCart } from '../context/cart.context';
import { getRandomProductImage } from '../../constants/images';

const { Title, Text } = Typography;

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const calculateDiscount = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    const discount = calculateDiscount(product.originalPrice, product.price);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const response = await isFavoriteApi(product._id);
                if (response && response.EC === 0) {
                    setIsFavorite(response.DT);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };
        checkFavoriteStatus();
    }, [product._id]);

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation();
        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                const response = await removeFromFavoritesApi(product._id);
                if (response && response.EC === 0) {
                    setIsFavorite(false);
                    message.success('Đã xóa khỏi danh sách yêu thích');
                } else {
                    message.error(response?.EM || 'Có lỗi xảy ra');
                }
            } else {
                const response = await addToFavoritesApi(product._id);
                if (response && response.EC === 0) {
                    setIsFavorite(true);
                    message.success('Đã thêm vào danh sách yêu thích');
                } else {
                    message.error(response?.EM || 'Có lỗi xảy ra');
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            message.error('Có lỗi xảy ra khi cập nhật danh sách yêu thích');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleViewDetail = async () => {
        try {
            await addToViewedProductsApi(product._id);
        } catch (error) {
            console.error('Error tracking viewed product:', error);
        }
        navigate(`/product/${product._id}`);
    };

    const handleAddToCartClick = async (e) => {
        e.stopPropagation();
        try {
            setCartLoading(true);
            await addToCart(product._id, 1);
            message.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setCartLoading(false);
        }
    };

    return (
        <Card
            hoverable
            className="card-fpt"
            style={{
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                background: 'var(--accent-color)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
            bodyStyle={{
                padding: 'var(--space-md)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
            cover={
                <div
                    style={{
                        position: 'relative',
                        aspectRatio: '1',
                        background: 'var(--background-light)',
                    }}
                >
                    <Image
                        alt={product.name}
                        src={product.images?.[0] || getRandomProductImage()}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-md)',
                            transition: 'transform 0.3s ease',
                        }}
                        preview={false}
                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.03)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                    {/* Featured Badge */}
                    {product.isFeatured && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 'var(--space-sm)',
                                left: 'var(--space-sm)',
                                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                zIndex: 2
                            }}
                        >
                            <CrownOutlined style={{ fontSize: '10px' }} />
                            Nổi bật
                        </div>
                    )}
                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: product.isFeatured ? '40px' : 'var(--space-sm)',
                                left: 'var(--space-sm)',
                                background: 'linear-gradient(135deg, #ff4757, #c44569)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                zIndex: 2
                            }}
                        >
                            <FireOutlined style={{ fontSize: '10px' }} />
                            -{discount}%
                        </div>
                    )}
                    {/* Sale Badge */}
                    {product.isOnSale && !discount && (
                        <div
                            style={{
                                position: 'absolute',
                                top: product.isFeatured ? '40px' : 'var(--space-sm)',
                                left: 'var(--space-sm)',
                                background: 'linear-gradient(135deg, #ff9ff3, #f368e0)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                zIndex: 2
                            }}
                        >
                            <FireOutlined style={{ fontSize: '10px' }} />
                            Khuyến mãi
                        </div>
                    )}
                    {/* Favorite Button */}
                    <Tooltip title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
                        <Button
                            type="text"
                            shape="circle"
                            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                            onClick={handleFavoriteToggle}
                            loading={favoriteLoading}
                            style={{
                                position: 'absolute',
                                top: 'var(--space-sm)',
                                right: 'var(--space-sm)',
                                width: '30px',
                                height: '30px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                color: isFavorite ? 'var(--error-color)' : 'var(--text-light)',
                                boxShadow: 'var(--shadow-sm)',
                            }}
                        />
                    </Tooltip>
                    {/* Out of Stock Overlay */}
                    {product.stock === 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-white)',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: 'var(--radius-md)',
                            }}
                        >
                            Hết hàng
                        </div>
                    )}
                </div>
            }
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <Title
                    level={5}
                    style={{
                        margin: 0,
                        color: 'var(--text-color)',
                        fontSize: '16px',
                        fontWeight: '600',
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {product.name}
                </Title>
                <Space align="baseline">
                    <Text
                        strong
                        style={{
                            fontSize: '16px',
                            color: 'var(--error-color)',
                            fontWeight: '600',
                        }}
                    >
                        {formatPrice(product.price)}
                    </Text>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <Text
                            delete
                            style={{
                                fontSize: '12px',
                                color: 'var(--text-light)',
                            }}
                        >
                            {formatPrice(product.originalPrice)}
                        </Text>
                    )}
                </Space>
                {product.rating > 0 && (
                    <Space size="small">
                        <StarOutlined style={{ color: 'var(--warning-color)', fontSize: '12px' }} />
                        <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {product.rating.toFixed(1)} ({product.reviewCount} đánh giá)
                        </Text>
                    </Space>
                )}
                <Space size="small" wrap>
                    {product.purchaseCount > 0 && (
                        <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <ShoppingOutlined style={{ color: 'var(--success-color)', marginRight: '4px' }} />
                            {product.purchaseCount} đã mua
                        </Text>
                    )}
                    {product.commentCount > 0 && (
                        <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <MessageOutlined style={{ color: 'var(--primary-color)', marginRight: '4px' }} />
                            {product.commentCount} bình luận
                        </Text>
                    )}
                </Space>
                <div
                    style={{
                        background:
                            product.stock > 10
                                ? 'var(--success-color)'
                                : product.stock > 0
                                    ? 'var(--warning-color)'
                                    : 'var(--error-color)',
                        color: 'var(--text-white)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '600',
                        alignSelf: 'flex-start',
                    }}
                >
                    {product.stock > 10 ? 'Còn hàng' : product.stock > 0 ? 'Sắp hết' : 'Hết hàng'}
                </div>
                {product.tags && product.tags.length > 0 && (
                    <Space size="small" wrap>
                        {product.tags.slice(0, 2).map((tag, index) => (
                            <Tag
                                key={index}
                                style={{
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--primary-light)',
                                    border: '1px solid var(--primary-color)',
                                    color: 'var(--primary-color)',
                                    fontSize: '12px',
                                    padding: '2px 6px',
                                }}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </Space>
                )}
                <Space
                    size="small"
                    style={{ marginTop: 'auto', width: '100%', justifyContent: 'space-between' }}
                >
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={handleViewDetail}
                        style={{
                            borderRadius: 'var(--radius-md)',
                            height: '36px',
                            fontSize: '14px',
                            fontWeight: '500',
                            background: 'var(--primary-color)',
                            border: 'none',
                            flex: 1,
                        }}
                    >
                        Xem chi tiết
                    </Button>
                    <Button
                        type="default"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleAddToCartClick}
                        loading={cartLoading}
                        disabled={product.stock === 0}
                        style={{
                            borderRadius: 'var(--radius-md)',
                            height: '36px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '2px solid var(--primary-color)',
                            background: 'transparent',
                            color: product.stock === 0 ? 'var(--text-light)' : 'var(--primary-color)',
                            flex: 1,
                        }}
                    >
                        Thêm vào giỏ
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default ProductCard;