import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background: #f5f5f5;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  
  &.edit {
    background: #1976d2;
    color: white;
  }
  
  &.delete {
    background: #d32f2f;
    color: white;
  }
  
  &.view {
    background: #388e3c;
    color: white;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 4px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &.primary {
    background: #1976d2;
    color: white;
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
  }
`;

const DataTable = ({ 
  collection, 
  data, 
  onEdit, 
  onDelete, 
  onView, 
  onAdd,
  loading = false,
  error = null 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'add'

  // Filtruj dane na podstawie wyszukiwania
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Paginacja
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Pobierz klucze z pierwszego elementu (nagłówki kolumn)
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (item) => {
    setEditingItem(item);
    setModalMode('view');
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem({});
    setModalMode('add');
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalMode === 'edit' && onEdit) {
      onEdit(editingItem);
    } else if (modalMode === 'add' && onAdd) {
      onAdd(editingItem);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (item) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten element?')) {
      onDelete(item);
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'Tak' : 'Nie';
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return String(value);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Ładowanie danych...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>Błąd: {error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Kolekcja: {collection}</h3>
        {onAdd && (
          <Button className="primary" onClick={handleAdd}>
            + Dodaj nowy
          </Button>
        )}
      </div>

      <SearchInput
        type="text"
        placeholder="Wyszukaj..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer>
        <Table>
          <thead>
            <tr>
              {columns.map(column => (
                <Th key={column}>{column}</Th>
              ))}
              <Th>Akcje</Th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <Tr key={item._id || index}>
                {columns.map(column => (
                  <Td key={column}>{formatValue(item[column])}</Td>
                ))}
                <Td>
                  {onView && (
                    <ActionButton className="view" onClick={() => handleView(item)}>
                      Podgląd
                    </ActionButton>
                  )}
                  {onEdit && (
                    <ActionButton className="edit" onClick={() => handleEdit(item)}>
                      Edytuj
                    </ActionButton>
                  )}
                  {onDelete && (
                    <ActionButton className="delete" onClick={() => handleDelete(item)}>
                      Usuń
                    </ActionButton>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        <PaginationContainer>
          <div>
            Pokazano {startIndex + 1}-{Math.min(endIndex, filteredData.length)} z {filteredData.length} elementów
          </div>
          <div>
            <PaginationButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Poprzednia
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationButton
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </PaginationButton>
            ))}
            <PaginationButton
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Następna
            </PaginationButton>
          </div>
        </PaginationContainer>
      </TableContainer>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>{modalMode === 'add' ? 'Dodaj nowy element' : modalMode === 'edit' ? 'Edytuj element' : 'Podgląd elementu'}</h3>
            
            {Object.keys(editingItem || {}).map(key => (
              <FormGroup key={key}>
                <Label>{key}</Label>
                {modalMode === 'view' ? (
                  <div style={{ padding: '8px 12px', background: '#f8f9fa', borderRadius: '4px' }}>
                    {formatValue(editingItem[key])}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={editingItem[key] || ''}
                    onChange={(e) => setEditingItem({...editingItem, [key]: e.target.value})}
                    disabled={key === '_id'}
                  />
                )}
              </FormGroup>
            ))}

            <ButtonGroup>
              <Button className="secondary" onClick={() => setShowModal(false)}>
                Anuluj
              </Button>
              {modalMode !== 'view' && (
                <Button className="primary" onClick={handleSave}>
                  Zapisz
                </Button>
              )}
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default DataTable; 