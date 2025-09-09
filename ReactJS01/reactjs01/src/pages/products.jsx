import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Typography,
    Spin,
    Alert,
    Space,
    Input,
    Select,
    Button,
    Card,
    Breadcrumb
} from 'antd';
import {
    SearchOutlined,
    HomeOutlined,
    AppstoreOutlined,
    FilterOutlined
} from '@ant-design/icons';
import {
    getAllProductsApi,
    getAllCategoriesApi,
    advancedSearchProductsApi
} from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import LazyLoading from '../components/common/LazyLoading';
import AdvancedSearch from '../components/common/AdvancedSearch';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [searchResults, setSearchResults] = useState(null);
    const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategoriesApi();
            if (response && response.EC === 0) {
                setCategories(response.DT || []);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProducts = async (page = 1, reset = true) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const response = await getAllProductsApi(page, 12, searchTerm);

            if (response && response.EC === 0) {
                const { products: newProducts, pagination } = response.DT;

                if (reset) {
                    setProducts(newProducts);
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                }

                setCurrentPage(page);
                setHasMore(pagination.hasNextPage);
            } else {
                setError(response?.EM || 'Không thể tải danh sách sản phẩm');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Có lỗi xảy ra khi tải danh sách sản phẩm');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(currentPage + 1, false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchProducts(1, true);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        if (value) {
            navigate(`/category/${value}`);
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        // TODO: Implement sorting
        console.log('Sort by:', value);
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product);
    };

    // Handle advanced search results
    const handleAdvancedSearchResults = (results) => {
        setSearchResults(results);
        setUseAdvancedSearch(true);
        setProducts(results.products || []);
        setCurrentPage(results.pagination?.currentPage || 1);
        setHasMore(results.pagination?.hasNextPage || false);
    };

    // Handle advanced search loading
    const handleAdvancedSearchLoading = (isLoading) => {
        setLoading(isLoading);
    };

    // Switch back to normal view
    const handleBackToNormal = () => {
        setUseAdvancedSearch(false);
        setSearchResults(null);
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('newest');
        fetchProducts();
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tải sản phẩm...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px' }}
                action={
                    <Button size="small" onClick={() => fetchProducts()}>
                        Thử lại
                    </Button>
                }
            />
        );
    }

    return (
        <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Breadcrumb */}
                <Card style={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                }}>
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <span
                                        onClick={() => navigate('/')}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#1890ff',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <HomeOutlined /> Trang chủ
                                    </span>
                                )
                            },
                            {
                                title: (
                                    <span style={{
                                        color: '#666',
                                        fontWeight: '500'
                                    }}>
                                        {useAdvancedSearch ? 'Kết quả tìm kiếm' : 'Tất cả sản phẩm'}
                                    </span>
                                )
                            }
                        ]}
                    />
                </Card>

                {/* Header */}
                <Card style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={2} style={{
                                margin: 0,
                                color: 'white',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                                {useAdvancedSearch ? '🔍 Kết quả tìm kiếm' : '🛍️ Tất cả sản phẩm'}
                            </Title>
                            {useAdvancedSearch && searchResults && (
                                <Text style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '16px',
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                                }}>
                                    ✨ Tìm thấy {searchResults.pagination?.totalProducts || 0} sản phẩm
                                </Text>
                            )}
                        </Col>
                        <Col>
                            {useAdvancedSearch && (
                                <Button
                                    onClick={handleBackToNormal}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ← Quay lại danh sách
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card>

                {/* Advanced Search Component */}
                <AdvancedSearch
                    onSearchResults={handleAdvancedSearchResults}
                    onLoading={handleAdvancedSearchLoading}
                    categories={categories}
                    initialFilters={{
                        query: searchTerm,
                        category: selectedCategory,
                        sortBy: sortBy
                    }}
                />

                {/* Legacy Filters (only show when not using advanced search) */}
                {!useAdvancedSearch && (
                    <Row gutter={[16, 16]} align="middle" style={{ marginTop: '20px' }}>
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Tìm kiếm sản phẩm..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onSearch={handleSearch}
                                style={{ width: '100%' }}
                            />
                        </Col>

                        <Col xs={12} sm={6} md={4}>
                            <Select
                                placeholder="Danh mục"
                                size="large"
                                style={{ width: '100%' }}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                allowClear
                            >
                                {categories.map((category) => (
                                    <Option key={category._id} value={category._id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        <Col xs={12} sm={6} md={4}>
                            <Select
                                placeholder="Sắp xếp"
                                size="large"
                                style={{ width: '100%' }}
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <Option value="newest">Mới nhất</Option>
                                <Option value="price-low">Giá thấp đến cao</Option>
                                <Option value="price-high">Giá cao đến thấp</Option>
                                <Option value="rating">Đánh giá cao</Option>
                            </Select>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Button
                                icon={<AppstoreOutlined />}
                                size="large"
                                onClick={() => navigate('/categories')}
                                style={{ width: '100%' }}
                            >
                                Xem theo danh mục
                            </Button>
                        </Col>
                    </Row>
                )}

                {/* Products Grid */}
                <Card style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                }}>
                    <LazyLoading
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                        loading={loadingMore}
                        error={error}
                    >
                        <Row gutter={[24, 24]}>
                            {products.map((product) => (
                                <Col
                                    key={product._id}
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    xl={6}
                                >
                                    <ProductCard
                                        product={product}
                                        onViewDetail={handleViewDetail}
                                        onAddToCart={handleAddToCart}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </LazyLoading>

                    {products.length === 0 && !loading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            borderRadius: '12px',
                            margin: '20px 0'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                            <Title level={3} style={{ color: '#666', marginBottom: '16px' }}>
                                Không tìm thấy sản phẩm nào
                            </Title>
                            <Text style={{
                                color: '#999',
                                fontSize: '16px',
                                display: 'block',
                                marginBottom: '24px'
                            }}>
                                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleBackToNormal}
                                style={{
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                                    border: 'none',
                                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                                }}
                            >
                                🔄 Thử lại
                            </Button>
                        </div>
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default ProductsPage;


