import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

export default function AlterarSenha() {
  const classes = useStyles();
  const notify = useNotify();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [valores, setValores] = useState({
    novaSenha: '',
    confirmarNovaSenha: '',
    mostrarSenha: false,
    mostrarConfirmarSenha: false,
  });

  useEffect(() => {
    if (!token) {
      notify.showError('Token inválido ou não fornecido');
    }
  }, [token, notify]);

  const alterarSenha = async event => {
    event.preventDefault();

    if (valores.novaSenha !== valores.confirmarNovaSenha) {
      notify.showError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      const Servico = new ServicoAutenticacao();
      const resetPasswordToken = token;
      console.log('resetPasswordToken: ', resetPasswordToken);
      console.log('valores.novaSenha: ', valores.novaSenha);
      await Servico.alterarSenha({
        token: resetPasswordToken,
        senha: valores.novaSenha,
      });
      notify.showSuccess(
        'Senha alterada com sucesso! Você será redirecionado para o login.',
      );

      setTimeout(() => {
        window.location.href = baseRoute;
      }, 2000);
    } catch (e) {
      notify.showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = prop => event => {
    setValores({ ...valores, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValores({ ...valores, mostrarSenha: !valores.mostrarSenha });
  };

  const handleClickShowConfirmPassword = () => {
    setValores({ ...valores, mostrarConfirmarSenha: !valores.mostrarConfirmarSenha });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <Box className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form autoComplete="off" onSubmit={alterarSenha}>
          <Grid align="center" style={{ marginBottom: '5px' }}>
            <img src={LogoBlack} alt="Logo Amaer" width="300px" />
          </Grid>
          <h2 style={{ margin: '14px 0' }}>Redefina sua Senha</h2>

          {/* Campo Nova Senha */}
          <FormControl className={clsx(classes.margin)} variant="outlined" fullWidth>
            <InputLabel required htmlFor="nova-senha">
              Nova Senha
            </InputLabel>
            <OutlinedInput
              id="nova-senha"
              type={valores.mostrarSenha ? 'text' : 'password'}
              value={valores.novaSenha}
              required
              onChange={handleChange('novaSenha')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {valores.mostrarSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={100}
            />
          </FormControl>

          <div style={{ height: 20 }} />

          {/* Campo Confirmar Nova Senha */}
          <FormControl className={clsx(classes.margin)} variant="outlined" fullWidth>
            <InputLabel required htmlFor="confirmar-senha">
              Confirmar Nova Senha
            </InputLabel>
            <OutlinedInput
              id="confirmar-senha"
              type={valores.mostrarConfirmarSenha ? 'text' : 'password'}
              value={valores.confirmarNovaSenha}
              required
              onChange={handleChange('confirmarNovaSenha')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {valores.mostrarConfirmarSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={180}
            />
          </FormControl>

          <div style={{ height: 10 }} />
          <Link href={baseRoute}>Voltar para o Login</Link>
          <div style={{ height: 20 }} />

          <div className={classes.wrapper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !token}
            >
              Redefinir Senha
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </form>
      </Paper>
    </Box>
  );
}
