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
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
import DraftsOutlinedIcon from '@material-ui/icons/DraftsOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import ServicoMensagens from '../../servicos/ServicoMensagens';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';
import useStyles from './estilo.css';

function Mensagens() {
  const classes = useStyles;
  const notify = useNotify();
  const { setLocation } = useNavigation();
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState('desc');  // Alterado de 'asc' para 'desc'
  const [orderBy, setOrderBy] = useState('dataEnvio');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Alterado para 5 como padrão
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMensagens = useCallback(async () => {
    setLoading(true);
    try {
      const response = search
        ? await ServicoMensagens.buscarPorNomeOuAssunto(
            search,
            rowsPerPage,
            page + 1,
            orderBy,
            order,
          )
        : await ServicoMensagens.listarMensagens(rowsPerPage, page + 1, orderBy, order);

      setMensagens(response.rows || []);
      setTotalItems(response.count || 0);
    } catch (error) {
      notify.showError(error.message);
      setMensagens([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [search, page, rowsPerPage, orderBy, order]);

  useEffect(() => {
    fetchMensagens();
  }, [fetchMensagens]);

  useEffect(() => {
    setLocation({
      title: 'Gestão de Mensagens',
      key: 'mensagens',
      path: '/mensagens',
    });
  }, []);

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    setPage(0);
  };

  const handleSearchChange = event => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleViewMessage = async mensagem => {
    try {
      await ServicoMensagens.marcarComoLida(mensagem.id);
      // Atualiza o estado local da mensagem
      setMensagens(mensagens.map(m => (m.id === mensagem.id ? { ...m, lida: true } : m)));
      setSelectedMessage(mensagem);
      setOpen(true);
    } catch (error) {
      notify.showError(error.message);
    }
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

  const handleMarkAsRead = async () => {
    if (selectedMessages.length === 0) return;

    try {
      setLoading(true);
      await Promise.all(selectedMessages.map(id => ServicoMensagens.marcarComoLida(id)));
      setMensagens(
        mensagens.map(m => (selectedMessages.includes(m.id) ? { ...m, lida: true } : m)),
      );
      notify.showSuccess('Mensagens marcadas como lidas');
      setSelectedMessages([]);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUnread = async () => {
    if (selectedMessages.length === 0) return;

    try {
      setLoading(true);
      await Promise.all(
        selectedMessages.map(id => ServicoMensagens.marcarComoNaoLida(id)),
      );
      setMensagens(
        mensagens.map(m => (selectedMessages.includes(m.id) ? { ...m, lida: false } : m)),
      );
      notify.showSuccess('Mensagens marcadas como não lidas');
      setSelectedMessages([]);
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

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <LinearProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (mensagens.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Nenhuma mensagem encontrada
          </TableCell>
        </TableRow>
      );
    }

    return mensagens.map(mensagem => (
      <TableRow key={mensagem.id} hover>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedMessages.includes(mensagem.id)}
            onChange={event => handleSelectMessage(event, mensagem.id)}
          />
        </TableCell>
        <TableCell padding="checkbox">
          {mensagem.lida ? (
            <DraftsOutlinedIcon style={{ color: '#9e9e9e' }} />
          ) : (
            <MailIcon color="primary" />
          )}
        </TableCell>
        <TableCell>
          <div style={{ fontSize: '14px' }}>
            {new Date(mensagem.dataEnvio).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(mensagem.dataEnvio).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </TableCell>
        <TableCell>{mensagem.nome}</TableCell>
        <TableCell>{mensagem.assunto}</TableCell>
        <TableCell>
          <div style={{ marginLeft: '20px' }}>{truncateText(mensagem.mensagem, 40)}</div>
        </TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            aria-label="visualizar"
            onClick={() => handleViewMessage(mensagem)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="deletar"
            onClick={() => {
              setMessageToDelete(mensagem);
              setDeleteDialog(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Container>
      <Breadcrumbs />
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
          placeholder="Buscar por nome ou assunto"
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
            color="primary"
            startIcon={<MailIcon />}
            onClick={handleMarkAsUnread}
            disabled={selectedMessages.length === 0}
            style={{ marginRight: '8px' }}
          >
            Marcar como não lida
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DraftsOutlinedIcon />}
            onClick={handleMarkAsRead}
            disabled={selectedMessages.length === 0}
            style={{ marginRight: '8px' }}
          >
            Marcar como lida
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={selectedMessages.length === 0}
          >
            Excluir
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" style={{ width: '48px' }}>
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
              <TableCell padding="checkbox" style={{ width: '48px' }}>
                Status
              </TableCell>
              <TableCell style={{ width: '180px' }}>
                <TableSortLabel
                  active={orderBy === 'dataEnvio'}
                  direction={orderBy === 'dataEnvio' ? order : 'asc'}
                  onClick={() => handleRequestSort('dataEnvio')}
                >
                  Data
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ width: '200px' }}>
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
              <TableCell>
                <TableSortLabel>Mensagem</TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ width: '120px' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
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
                <strong>Assunto:</strong> {truncateText(selectedMessage.assunto, 50)}
              </p>
              <p className={classes.messageText} style={{ whiteSpace: 'pre-wrap' }}>
                <strong>Mensagem:</strong>
                <br />
                {selectedMessage.mensagem.replace(/(.{50})/g, '$1\n')}
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
              {truncateText(messageToDelete.assunto, 50)}
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
