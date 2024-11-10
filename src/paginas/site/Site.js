import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  IconButton,
  Container,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  LinearProgress,
} from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Edit as EditIcon } from '@material-ui/icons';

import EditarTextoModal from '../../componentes/EditarTextoModal/EditarTextoModal';
import ServicoTextoModal from '../../servicos/ServicoTextoModal';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNavigation } from '../../contextos/Navegacao';

function TextoModal() {
  const [TextoModal, setTextoModal] = useState([]);
  const [open, setOpen] = useState(false);
  const [TextoModalSelecionado, setTextoModalSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  const fecharFormulario = () => {
    setOpen(false);
    fetchData();
  };

  function onSaveTextoModal() {
    fecharFormulario();
  }

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Modificar o site',
      key: 'site',
      path: '/site',
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const dadosAPI = await ServicoTextoModal.listarTextoModal();
      setTextoModal(dadosAPI);
      setLoading(false);
    } catch (error) {
      // Trate o erro aqui conforme necessário
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container className={styles.root}>
      <Breadcrumbs />
      <TableContainer component={Paper}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Titulo</TableCell>
              <TableCell>Corpo</TableCell>
              <TableCell />
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
              if (TextoModal.length > 0) {
                return TextoModal.map(textoModal => (
                  <TableRow key={textoModal.id}>
                    <TableCell> </TableCell>
                    <TableCell className={styles.celula}>{textoModal.titulo}</TableCell>
                    <ReactQuill
                      value={
                        textoModal.corpo.length > 360
                          ? `${textoModal.corpo.substring(0, 360)}...`
                          : textoModal.corpo
                      }
                      readOnly
                      theme={null}
                    />
                    <TableCell align="right">
                      <IconButton
                        aria-label="editar"
                        onClick={() => {
                          setTextoModalSelecionado(TextoModal);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ));
              }
              return (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhum texto encontrado
                  </TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </TableContainer>
      <EditarTextoModal
        open={open}
        textoModal={TextoModalSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveTextoModal()}
      />
    </Container>
  );
}

export default TextoModal;
