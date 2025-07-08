import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  Grid,
  Box,
  Paper,
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  Button,
  FormControl,
  CircularProgress,
  Link,
} from '@material-ui/core';
import clsx from 'clsx';

import { baseRoute } from '../../uteis/rota.json';
import { useStyles } from './estilo';
import { useNotify } from '../../contextos/Notificacao';
import ServicoAutenticacao from '../../servicos/ServicoAutenticacao';
import LogoBlack from '../../assets/logo-black.png';

export default function EsqueceuSuaSenha() {
  const classes = useStyles();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [valores, setValores] = useState({
    email: '',
    novaSenha: '',
    confirmarNovaSenha: '',
    mostrarSenha: false,
  });

  const solicitarAlteracaoSenha = async event => {
    if (valores.novaSenha !== valores.confirmarNovaSenha) return;

    event.preventDefault();
    try {
      setLoading(true);
      const Servico = new ServicoAutenticacao();
      await Servico.solicitarAlteracaoSenha({
        email: valores.email,
        senha: valores.novaSenha,
      });
      notify.showSuccess('Cheque seu e-mail para continuar a alteração.');
    } catch (e) {
      notify.showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = prop => event => {
    setValores({ ...valores, [prop]: event.target.value });
  };

  return (
    <Box className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form autoComplete="off" onSubmit={solicitarAlteracaoSenha}>
          <Grid align="center" style={{ marginBottom: '5px' }}>
            <img src={LogoBlack} alt="Logo Amaer" width="300px" />
          </Grid>
          <h2 style={{ margin: '14px 0' }}>Alterar Senha</h2>
          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            required
            value={valores.email}
            onChange={handleChange('email')}
          />
          <div style={{ height: 20 }} />
          <div className={classes.wrapper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Solicitar Alteração
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </form>
      </Paper>
    </Box>
  );
}
