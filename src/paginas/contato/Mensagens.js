import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  IconButton,
  Box,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import ServicoMensagens from '../../servicos/ServicoMensagens';
import { useNotify } from '../../contextos/Notificacao';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  search: {
    marginBottom: 20,
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  dialogContent: {
    width: '500px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  messageText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
});

function Mensagens() {
  const classes = useStyles();
  const notify = useNotify();
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('dataEnvio');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMensagens = useCallback(async () => {
    setLoading(true);
    try {
      const response = search
        ? await ServicoMensagens.buscarPorTitulo(search, rowsPerPage, page + 1)
        : await ServicoMensagens.listarMensagens(rowsPerPage, page + 1);

      setMensagens(response.rows || []);
      setTotalItems(response.count || 0);
    } catch (error) {
      notify.showError(error.message);
      setMensagens([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [search, page, rowsPerPage]);

  useEffect(() => {
    fetchMensagens();
  }, [fetchMensagens]);

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = event => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleViewMessage = mensagem => {
    setSelectedMessage(mensagem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMessage(null);
  };

  const handleDeleteSelected = async () => {
    if (selectedMessages.length === 0) return;

    try {
      setLoading(true);
      await Promise.all(selectedMessages.map(id => ServicoMensagens.deletarMensagem(id)));
      setSelectedMessages([]);
      notify.showSuccess('Mensagens excluídas com sucesso');
      await fetchMensagens(); // Recarrega a lista após excluir
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function onCloseRemoveMessage() {
    setDeleteDialog(false);
    setMessageToDelete(null);
  }

  const handleDeleteMessage = async id => {
    try {
      setRemoving(true);
      await ServicoMensagens.deletarMensagem(id);
      onCloseRemoveMessage();
      notify.showSuccess('Mensagem excluída com sucesso');
      await fetchMensagens(); // Recarrega a lista após excluir
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  };

  const handleSelectMessage = (event, id) => {
    if (event.target.checked) {
      setSelectedMessages([...selectedMessages, id]);
    } else {
      setSelectedMessages(selectedMessages.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        paddingBottom="18px"
        paddingTop="12px"
      >
        <TextField
          placeholder="Buscar por título"
          variant="outlined"
          size="small"
          style={{ width: '100%', maxWidth: '400px' }}
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" flexDirection="row" alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
          >
            Excluir
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedMessages.length > 0 &&
                    selectedMessages.length < mensagens.length
                  }
                  checked={
                    mensagens.length > 0 && selectedMessages.length === mensagens.length
                  }
                  onChange={event => {
                    if (event.target.checked) {
                      setSelectedMessages(mensagens.map(mensagem => mensagem.id));
                    } else {
                      setSelectedMessages([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dataEnvio'}
                  direction={orderBy === 'dataEnvio' ? order : 'asc'}
                  onClick={() => handleRequestSort('dataEnvio')}
                >
                  Data
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'nome'}
                  direction={orderBy === 'nome' ? order : 'asc'}
                  onClick={() => handleRequestSort('nome')}
                >
                  Nome
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'assunto'}
                  direction={orderBy === 'assunto' ? order : 'asc'}
                  onClick={() => handleRequestSort('assunto')}
                >
                  Assunto
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(() => {
              if (loading) {
                return (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                );
              }
              if (mensagens.length > 0) {
                return mensagens.map(mensagem => (
                  <TableRow key={mensagem.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedMessages.includes(mensagem.id)}
                        onChange={event => handleSelectMessage(event, mensagem.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(mensagem.dataEnvio).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{mensagem.nome}</TableCell>
                    <TableCell>{mensagem.assunto}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="visualizar"
                        onClick={() => handleViewMessage(mensagem)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="deletar"
                        onClick={() => {
                          setMessageToDelete(mensagem);
                          setDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ));
              }
              return (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhuma mensagem encontrada
                  </TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </TableContainer>
      {!loading && mensagens.length >= 1 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={event => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Itens por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
          disabled={loading}
        />
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Mensagem</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {selectedMessage && (
            <>
              <p>
                <strong>Nome:</strong> {selectedMessage.nome}
              </p>
              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <p>
                <strong>Assunto:</strong> {selectedMessage.assunto}
              </p>
              <p className={classes.messageText}>
                <strong>Mensagem:</strong> {selectedMessage.mensagem}
              </p>
            </>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialog}
        onClose={onCloseRemoveMessage}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '20px' }}>
          Excluir mensagem:
          {messageToDelete && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {messageToDelete.assunto}
            </span>
          )}
        </DialogTitle>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button color="primary" onClick={onCloseRemoveMessage}>
            Cancelar
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={removing}
              onClick={() => handleDeleteMessage(messageToDelete.id)}
            >
              Excluir
            </Button>
            {removing && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Mensagens;
