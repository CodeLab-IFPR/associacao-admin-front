import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  Block as BlockIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
} from '@material-ui/icons';
import { format } from 'date-fns';
import ServicoDocumento from '../../servicos/ServicoDocumentos';
import { useNotify } from '../../contextos/Notificacao';
import CadastrarDocumento from '../../componentes/CadastrarDocumento/CadastrarDocumento';
import styles from './estilo.css';
import ServicoAutenticacao from '../../servicos/ServicoAutenticacao';

function Documentos() {
  const notify = useNotify();
  const [documentos, setDocumentos] = useState([]);
  const [openCadastrarDocumento, setOpenCadastrarDocumento] = useState(false);
  const [associadoId, setAssociadoId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const Servico = new ServicoAutenticacao();

  useEffect(() => {
    async function obterUsuario() {
      try {
        const usuario = await Servico.obterAssociadoLogado();
        setAssociadoId(usuario.id);
        setIsAdmin(usuario.perfil === 'ADMIN');
      } catch (error) {
        notify.showError('Erro ao obter o usuário logado.');
      }
    }
    obterUsuario();
  }, []);

  useEffect(() => {
    if (associadoId || isAdmin) {
      fetchDocumentos();
    }
  }, [associadoId, isAdmin]);

  async function fetchDocumentos() {
    try {
      let response;
      if (isAdmin) {
        response = await ServicoDocumento.buscarDocumentos(10, 1, null, true); // Admin não precisa de associadoId
      } else if (associadoId) {
        response = await ServicoDocumento.buscarDocumentos(10, 1, associadoId);
      }
      setDocumentos(response.rows);
    } catch (error) {
      notify.showError('Erro ao carregar documentos.');
    }
  }

  async function invalidarDocumento(id) {
    try {
      await ServicoDocumento.invalidarDocumento(id);
      setDocumentos(
        documentos.map(doc => (doc.id === id ? { ...doc, status: 'INVALIDO' } : doc)),
      );
      notify.showSuccess('Documento invalidado com sucesso.');
    } catch (error) {
      notify.showError('Erro ao invalidar documento.');
    }
  }

  async function validarDocumento(id) {
    try {
      await ServicoDocumento.validarDocumento(id);
      setDocumentos(
        documentos.map(doc => (doc.id === id ? { ...doc, status: 'VALIDO' } : doc)),
      );
      notify.showSuccess('Documento validado com sucesso.');
    } catch (error) {
      notify.showError('Erro ao validar documento.');
    }
  }

  async function downloadDocumento(id) {
    try {
      const data = await ServicoDocumento.downloadDocumento(id);
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'documento.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      notify.showError('Erro ao baixar documento.');
    }
  }

  function handleOpenCadastrarDocumento() {
    setOpenCadastrarDocumento(true);
  }

  function handleCloseCadastrarDocumento() {
    setOpenCadastrarDocumento(false);
    fetchDocumentos();
  }

  function formatarData(data) {
    return format(new Date(data), 'dd/MM/yyyy');
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Documentos Anexados
      </Typography>
      <Paper className={styles.paper}>
        <List>
          {documentos.map(doc => (
            <ListItem key={doc.id}>
              <ListItemText
                primary={doc.titulo}
                secondary={`Criado por: ${doc.associadoNome} - Tipo: ${
                  doc.tipo
                } - Data de Upload: ${formatarData(doc.dataUpload)} - Status: ${
                  doc.status === 'VALIDO' ? 'válido' : 'invalidado'
                }`}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Visualizar Documento">
                  <IconButton
                    edge="end"
                    aria-label="visualizar"
                    onClick={() => downloadDocumento(doc.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {isAdmin &&
                  (doc.status === 'VALIDO' ? (
                    <Tooltip title="Invalidar Documento">
                      <IconButton
                        edge="end"
                        aria-label="invalidar"
                        onClick={() => invalidarDocumento(doc.id)}
                      >
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Validar Documento">
                      <IconButton
                        edge="end"
                        aria-label="validar"
                        onClick={() => validarDocumento(doc.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  ))}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCadastrarDocumento}
        style={{ marginTop: '16px' }}
      >
        Criar Documento
      </Button>
      <CadastrarDocumento
        open={openCadastrarDocumento}
        fecharFormulario={handleCloseCadastrarDocumento}
      />
    </div>
  );
}

export default Documentos;
