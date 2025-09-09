import React from 'react';
import { Card, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getRandomCategoryImage } from '../../constants/images';

const { Title, Text } = Typography;

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleCategoryClick = () => {
        navigate(`/category/${category._id}`);
    };

    return (
        <Card
            hoverable
            className="card-hover"
            onClick={handleCategoryClick}
            style={{ 
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                background: 'white',
                height: '100%',
                transition: 'var(--transition)'
            }}
            bodyStyle={{ 
                padding: 'var(--space-md)',
                textAlign: 'center'
            }}
            cover={
                <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    background: 'var(--background-light)'
                }}>
                    <Image
                        alt={category.name}
                        src={category.image || getRandomCategoryImage()}
                        style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'var(--transition)'
                        }}
                        preview={false}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    />
                </div>
            }
        >
            <div style={{ 
                padding: 'var(--space-xs)',
                transition: 'var(--transition)'
            }}>
                <Title level={4} style={{ 
                    margin: 0,
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--text-color)',
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '1.3'
                }}>
                    {category.name}
                </Title>
                <Text 
                    type="secondary" 
                    style={{ 
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                        display: 'block'
                    }}
                >
                    {category.description}
                </Text>
            </div>
        </Card>
    );
};

export default CategoryCard;


