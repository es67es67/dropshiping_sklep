import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight, FaFolder, FaFolderOpen } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primaryHover};
  }
`;

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryTree = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
`;

const TreeTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const TreeNode = styled.div`
  margin-left: ${props => props.level * 20}px;
  margin-bottom: 0.5rem;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.hover};
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const CategoryName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const CategoryStats = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: ${props => props.theme.textSecondary};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: ${props => props.theme.textSecondary};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const FormContainer = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.primaryHover};
    }
  }
  
  &.secondary {
    background: ${props => props.theme.border};
    color: ${props => props.theme.text};
    
    &:hover {
      background: ${props => props.theme.hover};
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const CategoryManagement = ({ theme }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    icon: '',
    order: 0,
    showInMenu: true,
    showOnHomepage: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania kategorii:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = editingCategory 
        ? `${apiUrl}/api/categories/${editingCategory._id}`
        : `${apiUrl}/api/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({
          name: '',
          description: '',
          parent: '',
          icon: '',
          order: 0,
          showInMenu: true,
          showOnHomepage: false
        });
        fetchCategories();
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania kategorii:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent: category.parent || '',
      icon: category.icon || '',
      order: category.order || 0,
      showInMenu: category.showInMenu,
      showOnHomepage: category.showOnHomepage
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę kategorię?')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Błąd podczas usuwania kategorii:', error);
    }
  };

  const toggleExpanded = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map(category => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.has(category._id);
      
      return (
        <div key={category._id}>
          <TreeNode level={level}>
            <CategoryItem>
              <CategoryInfo>
                {hasChildren && (
                  <ExpandButton onClick={() => toggleExpanded(category._id)}>
                    {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                  </ExpandButton>
                )}
                {isExpanded ? <FaFolderOpen /> : <FaFolder />}
                <CategoryName>{category.name}</CategoryName>
                <CategoryStats>
                  ({category.stats?.productCount || 0} produktów)
                </CategoryStats>
              </CategoryInfo>
              <CategoryActions>
                <ActionButton onClick={() => handleEdit(category)} title="Edytuj">
                  <FaEdit />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(category._id)} title="Usuń">
                  <FaTrash />
                </ActionButton>
              </CategoryActions>
            </CategoryItem>
          </TreeNode>
          
          {hasChildren && isExpanded && (
            <div>
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Container>
      <Title>Zarządzanie kategoriami</Title>
      
      <Header>
        <div>
          <h2>Kategorie produktów</h2>
          <p>Zarządzaj hierarchią kategorii i podkategorii</p>
        </div>
        <AddButton onClick={() => setShowForm(true)}>
          <FaPlus />
          Dodaj kategorię
        </AddButton>
      </Header>

      <CategoriesContainer>
        <CategoryTree>
          <TreeTitle>Drzewo kategorii</TreeTitle>
          {renderCategoryTree(categories)}
        </CategoryTree>

        {showForm && (
          <FormContainer>
            <FormTitle>
              {editingCategory ? 'Edytuj kategorię' : 'Dodaj nową kategorię'}
            </FormTitle>
            
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <Label>Nazwa kategorii *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Wprowadź nazwę kategorii"
                  required
                />
              </FormRow>

              <FormRow>
                <Label>Opis</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Opis kategorii (opcjonalny)"
                />
              </FormRow>

              <FormRow>
                <Label>Kategoria nadrzędna</Label>
                <Select
                  name="parent"
                  value={formData.parent}
                  onChange={handleInputChange}
                >
                  <option value="">Brak (kategoria główna)</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormRow>

              <FormRow>
                <Label>Ikona</Label>
                <Input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="Nazwa ikony (np. fa-home)"
                />
              </FormRow>

              <FormRow>
                <Label>Kolejność</Label>
                <Input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                />
              </FormRow>

              <FormRow>
                <Label>
                  <input
                    type="checkbox"
                    name="showInMenu"
                    checked={formData.showInMenu}
                    onChange={handleInputChange}
                  />
                  Pokaż w menu
                </Label>
              </FormRow>

              <FormRow>
                <Label>
                  <input
                    type="checkbox"
                    name="showOnHomepage"
                    checked={formData.showOnHomepage}
                    onChange={handleInputChange}
                  />
                  Pokaż na stronie głównej
                </Label>
              </FormRow>

              <ButtonGroup>
                <Button type="submit" className="primary">
                  {editingCategory ? 'Zapisz zmiany' : 'Dodaj kategorię'}
                </Button>
                <Button 
                  type="button" 
                  className="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                    setFormData({
                      name: '',
                      description: '',
                      parent: '',
                      icon: '',
                      order: 0,
                      showInMenu: true,
                      showOnHomepage: false
                    });
                  }}
                >
                  Anuluj
                </Button>
              </ButtonGroup>
            </Form>
          </FormContainer>
        )}
      </CategoriesContainer>
    </Container>
  );
};

export default CategoryManagement; 