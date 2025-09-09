import React, { useState, useEffect, useCallback } from 'react';
import {
    Row,
    Col,
    Input,
    Select,
    Slider,
    Button,
    Card,
    Space,
    Typography,
    AutoComplete,
    Switch,
    Divider,
    Collapse,
    Badge,
    Tooltip,
    Tag
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    DownOutlined,
    UpOutlined,
    StarOutlined,
    DollarOutlined,
    TagsOutlined,
    FireOutlined,
    CrownOutlined
} from '@ant-design/icons';
import { advancedSearchProductsApi, getSearchSuggestionsApi } from '../../util/apis';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const AdvancedSearch = ({ 
    onSearchResults, 
    onLoading, 
    categories = [], 
    initialFilters = {} 
}) => {
    const [searchParams, setSearchParams] = useState({
        query: initialFilters.query || '',
        category: initialFilters.category || '',
        minPrice: initialFilters.minPrice || 0,
        maxPrice: initialFilters.maxPrice || 1000000,
        minRating: initialFilters.minRating || 0,
        maxRating: initialFilters.maxRating || 5,
        isOnSale: initialFilters.isOnSale || null,
        isFeatured: initialFilters.isFeatured || null,
        sortBy: initialFilters.sortBy || 'createdAt',
        sortOrder: initialFilters.sortOrder || 'desc',
        page: 1,
        limit: 12
    });

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Debounced search suggestions
    const getSuggestions = useCallback(
        debounce(async (query) => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await getSearchSuggestionsApi(query, 10);
                if (response && response.EC === 0) {
                    setSuggestions(response.DT.map(item => ({ value: item.text })));
                }
            } catch (error) {
                console.error('Error getting suggestions:', error);
            }
        }, 300),
        []
    );

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearchParams(prev => ({ ...prev, query: value }));
        getSuggestions(value);
    };

    // Handle search
    const handleSearch = async (resetPage = true) => {
        setLoading(true);
        onLoading(true);

        try {
            const params = {
                ...searchParams,
                page: resetPage ? 1 : searchParams.page
            };

            const response = await advancedSearchProductsApi(params);
            
            if (response && response.EC === 0) {
                onSearchResults(response.DT);
            } else {
                onSearchResults({
                    products: [],
                    pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 },
                    searchInfo: params
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            onSearchResults({
                products: [],
                pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 },
                searchInfo: searchParams
            });
        } finally {
            setLoading(false);
            onLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setSearchParams(prev => ({ ...prev, [key]: value }));
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchParams({
            query: '',
            category: '',
            minPrice: 0,
            maxPrice: 1000000,
            minRating: 0,
            maxRating: 5,
            isOnSale: null,
            isFeatured: null,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 12
        });
        setSuggestions([]);
    };

    // Format price for display
    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Format rating for display
    const formatRating = (value) => {
        return `${value} ⭐`;
    };

    // Count active filters
    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchParams.category) count++;
        if (searchParams.minPrice > 0 || searchParams.maxPrice < 1000000) count++;
        if (searchParams.minRating > 0 || searchParams.maxRating < 5) count++;
        if (searchParams.isOnSale !== null) count++;
        if (searchParams.isFeatured !== null) count++;
        return count;
    };

    return (
        <Card 
            style={{ 
                marginBottom: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none'
            }}
            bodyStyle={{ padding: '24px' }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Main Search Bar */}
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={16} md={18}>
                        <AutoComplete
                            options={suggestions}
                            value={searchParams.query}
                            onChange={handleSearchChange}
                            placeholder="🔍 Tìm kiếm sản phẩm với Fuzzy Search..."
                            style={{ width: '100%' }}
                            size="large"
                        >
                            <Input
                                prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                                onPressEnter={() => handleSearch()}
                                allowClear
                                style={{
                                    borderRadius: '8px',
                                    border: '2px solid #f0f0f0',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#1890ff';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#f0f0f0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </AutoComplete>
                    </Col>
                    <Col xs={12} sm={4} md={3}>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            size="large"
                            loading={loading}
                            onClick={() => handleSearch()}
                            style={{ 
                                width: '100%',
                                borderRadius: '8px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                    <Col xs={12} sm={4} md={3}>
                        <Badge 
                            count={getActiveFiltersCount()} 
                            size="small"
                            style={{ backgroundColor: '#52c41a' }}
                        >
                            <Button
                                icon={<FilterOutlined />}
                                size="large"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                style={{ 
                                    width: '100%',
                                    borderRadius: '8px',
                                    height: '40px',
                                    border: '2px solid #f0f0f0',
                                    background: showAdvanced ? '#f6ffed' : '#fff'
                                }}
                            >
                                {showAdvanced ? <UpOutlined /> : <DownOutlined />} Bộ lọc
                            </Button>
                        </Badge>
                    </Col>
                </Row>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div style={{
                        background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #e6f7ff'
                    }}>
                        <Row gutter={[24, 24]}>
                            {/* Category Filter */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                                        <TagsOutlined style={{ marginRight: '8px' }} />
                                        Danh mục
                                    </Text>
                                    <Select
                                        placeholder="Chọn danh mục"
                                        style={{ width: '100%', marginTop: '8px' }}
                                        value={searchParams.category}
                                        onChange={(value) => handleFilterChange('category', value)}
                                        allowClear
                                        size="large"
                                        suffixIcon={<TagsOutlined />}
                                    >
                                        {categories.map(category => (
                                            <Option key={category._id} value={category._id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>

                            {/* Price Range */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ fontSize: '14px', color: '#52c41a' }}>
                                        <DollarOutlined style={{ marginRight: '8px' }} />
                                        Khoảng giá
                                    </Text>
                                    <div style={{ marginTop: '8px' }}>
                                        <Slider
                                            range
                                            min={0}
                                            max={1000000}
                                            step={10000}
                                            value={[searchParams.minPrice, searchParams.maxPrice]}
                                            onChange={(value) => {
                                                handleFilterChange('minPrice', value[0]);
                                                handleFilterChange('maxPrice', value[1]);
                                            }}
                                            tooltip={{
                                                formatter: formatPrice
                                            }}
                                            trackStyle={{ background: 'linear-gradient(90deg, #52c41a, #1890ff)' }}
                                            handleStyle={{ 
                                                borderColor: '#1890ff',
                                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                                            }}
                                        />
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            fontSize: '12px',
                                            marginTop: '8px',
                                            color: '#666'
                                        }}>
                                            <Tag color="green">{formatPrice(searchParams.minPrice)}</Tag>
                                            <Tag color="blue">{formatPrice(searchParams.maxPrice)}</Tag>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* Rating Range */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ fontSize: '14px', color: '#fa8c16' }}>
                                        <StarOutlined style={{ marginRight: '8px' }} />
                                        Đánh giá
                                    </Text>
                                    <div style={{ marginTop: '8px' }}>
                                        <Slider
                                            range
                                            min={0}
                                            max={5}
                                            step={0.1}
                                            value={[searchParams.minRating, searchParams.maxRating]}
                                            onChange={(value) => {
                                                handleFilterChange('minRating', value[0]);
                                                handleFilterChange('maxRating', value[1]);
                                            }}
                                            tooltip={{
                                                formatter: formatRating
                                            }}
                                            trackStyle={{ background: 'linear-gradient(90deg, #fa8c16, #fadb14)' }}
                                            handleStyle={{ 
                                                borderColor: '#fa8c16',
                                                boxShadow: '0 2px 8px rgba(250, 140, 22, 0.3)'
                                            }}
                                        />
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            fontSize: '12px',
                                            marginTop: '8px',
                                            color: '#666'
                                        }}>
                                            <Tag color="orange">{formatRating(searchParams.minRating)}</Tag>
                                            <Tag color="gold">{formatRating(searchParams.maxRating)}</Tag>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* Sort Options */}
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ fontSize: '14px', color: '#722ed1' }}>
                                        📊 Sắp xếp
                                    </Text>
                                    <Select
                                        style={{ width: '100%', marginTop: '8px' }}
                                        value={searchParams.sortBy}
                                        onChange={(value) => handleFilterChange('sortBy', value)}
                                        size="large"
                                    >
                                        <Option value="createdAt">🆕 Mới nhất</Option>
                                        <Option value="price">💰 Giá</Option>
                                        <Option value="rating">⭐ Đánh giá</Option>
                                        <Option value="viewCount">👀 Lượt xem</Option>
                                        <Option value="name">🔤 Tên A-Z</Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '24px 0', borderColor: '#e6f7ff' }} />

                        <Row gutter={[24, 24]}>
                            {/* Special Filters */}
                            <Col xs={24} sm={8} md={6}>
                                <div style={{ 
                                    background: '#fff2e8',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ffd591'
                                }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text strong style={{ color: '#d4380d' }}>
                                            <FireOutlined style={{ marginRight: '8px' }} />
                                            Chỉ sản phẩm khuyến mãi
                                        </Text>
                                        <Switch
                                            checked={searchParams.isOnSale === true}
                                            onChange={(checked) => 
                                                handleFilterChange('isOnSale', checked ? true : null)
                                            }
                                            style={{ 
                                                background: searchParams.isOnSale ? '#ff4d4f' : undefined
                                            }}
                                        />
                                    </Space>
                                </div>
                            </Col>

                            <Col xs={24} sm={8} md={6}>
                                <div style={{ 
                                    background: '#f6ffed',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #b7eb8f'
                                }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text strong style={{ color: '#389e0d' }}>
                                            <CrownOutlined style={{ marginRight: '8px' }} />
                                            Chỉ sản phẩm nổi bật
                                        </Text>
                                        <Switch
                                            checked={searchParams.isFeatured === true}
                                            onChange={(checked) => 
                                                handleFilterChange('isFeatured', checked ? true : null)
                                            }
                                            style={{ 
                                                background: searchParams.isFeatured ? '#52c41a' : undefined
                                            }}
                                        />
                                    </Space>
                                </div>
                            </Col>

                            <Col xs={24} sm={8} md={6}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                                        🔄 Thứ tự
                                    </Text>
                                    <Select
                                        style={{ width: '100%', marginTop: '8px' }}
                                        value={searchParams.sortOrder}
                                        onChange={(value) => handleFilterChange('sortOrder', value)}
                                        size="large"
                                    >
                                        <Option value="desc">📉 Giảm dần</Option>
                                        <Option value="asc">📈 Tăng dần</Option>
                                    </Select>
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={6}>
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={handleClearFilters}
                                    style={{ 
                                        width: '100%', 
                                        height: '48px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    🗑️ Xóa bộ lọc
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </Space>
        </Card>
    );
};

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default AdvancedSearch;
