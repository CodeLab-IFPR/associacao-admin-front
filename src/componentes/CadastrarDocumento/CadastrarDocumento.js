import React, { useEffect, useState, useRef } from 'react';
import {
  FormControl,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import 'date-fns';
import ServicoDocumento from '../../servicos/ServicoDocumentos';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';
import ServicoAutenticacao from '../../servicos/ServicoAutenticacao';

function CadastrarDocumento(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();
  const [saving, setSaving] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anexo, setAnexo] = useState(null);
  const [nomeDocumento, setNomeDocumento] = useState('');
  const closeButtonRef = useRef(null);
  const [associadoId, setAssociadoId] = useState(null);
  const [associadoNome, setNomeAssociado] = useState('');

  const Servico = new ServicoAutenticacao();

  useEffect(() => {
    async function fetchAssociadoId() {
      try {
        const associado = await Servico.obterAssociadoLogado();
        setAssociadoId(associado.id);
      } catch (error) {
        notify.showError('Erro ao buscar associado');
      }
    }

    fetchAssociadoId();
  }, []);

  useEffect(() => {
    async function fetchNomeAssociado() {
      try {
        const associado = await Servico.obterAssociadoLogado();
        setNomeAssociado(associado.nome);
      } catch (error) {
        notify.showError('Erro ao buscar associado');
      }
    }

    fetchNomeAssociado();
  }, []);

  async function salvarDocumento(event) {
    event.preventDefault();
    try {
      setSaving(true);
      let tipo = 'PDF';
      if (anexo) {
        tipo = anexo.type.startsWith('image/') ? 'IMAGE' : 'PDF';
      }
      const data = {
        titulo,
        associadoNome, // Certifique-se de que o nome do associado está sendo passado corretamente
        descricao,
        nomeDocumento,
        tipo,
        associadoId,
      };
      const novoDocumento = await ServicoDocumento.criarDocumento(data);

      if (anexo) {
        await ServicoDocumento.uploadDocumento(novoDocumento.id, anexo);
      }
      notify.showSuccess('Documento salvo com sucesso!');
      props.fecharFormulario();
      limparAnexo();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!props.open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [props.open]);

  function limparAnexo() {
    setAnexo(null);
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          props.fecharFormulario();
        }}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="md" // Use one of the predefined values
        fullScreen={isMobile}
      >
        <form autoComplete="off" onSubmit={event => salvarDocumento(event)}>
          <DialogTitle id="form-dialog-title">Cadastrar Documentos</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="h6" className={styles.title}>
                    Dados do documento
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={styles.fieldMargin}
                >
                  <TextField
                    autoFocus
                    value={titulo}
                    label="Título do documento"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    required
                    variant="outlined"
                    onChange={event => setTitulo(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={styles.fieldMargin}
                >
                  <TextField
                    value={descricao}
                    label="Descrição do documento"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    variant="outlined"
                    onChange={event => setDescricao(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={styles.fieldMargin}
                >
                  <TextField
                    value={nomeDocumento}
                    label="Nome do Documento"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    required
                    variant="outlined"
                    onChange={event => setNomeDocumento(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth className={styles.fieldMargin}>
                  <input
                    accept="application/pdf,image/*"
                    style={{ display: 'none' }}
                    id="anexo-upload"
                    type="file"
                    onChange={event => {
                      const file = event.target.files[0];
                      setAnexo(file);
                    }}
                  />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="anexo-upload">
                    <Button variant="contained" color="primary" component="span">
                      Selecionar Anexo
                    </Button>
                    <span style={{ marginLeft: '10px', color: 'red' }}>
                      *Somente PDF ou Imagem
                    </span>
                  </label>
                  {anexo && (
                    <Typography variant="body1" className={styles.fileLabel}>
                      {anexo.name}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ padding: '16px' }}>
            <Button
              color="primary"
              style={{ marginRight: '12px' }}
              disabled={saving}
              onClick={() => {
                props.fecharFormulario();
                limparAnexo();
              }}
            >
              Cancelar
            </Button>
            <div className={styles.wrapper}>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                Salvar
              </Button>
              {saving && <CircularProgress size={24} className={styles.buttonProgress} />}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default CadastrarDocumento;
