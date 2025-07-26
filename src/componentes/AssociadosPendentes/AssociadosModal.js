import React, { useEffect, useState } from 'react';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';
import { useStyles } from './estilo';

const ModalConfirm = ({ confirm, open, exclude, cancel, associado }) => {
  if (!open || !associado) return null;
  const [removing, setRemoving] = useState([]);
  const [accepting, setAccepting] = useState([]);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [telCelular, setTelCelular] = useState('');
  const [whatsapp, setWhatsapp] = useState(false);
  const [telComercial, setTelComercial] = useState('');
  const [telResidencial, setTelResidencial] = useState('');
  const [email, setEmail] = useState('');
  const [emailAlternativo, setEmailAlternativo] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [perfil, setPerfil] = useState('Associado');

  useEffect(() => {
    if (associado) {
      setNome(associado.nome || 'Não informado');
      setSobrenome(associado.sobrenome || 'Não informado');
      setDataNascimento(() => {
        if (associado.data_nascimento === null) return 'Não informado';
        const data = associado.data_nascimento.toString().substring(0, 10);
        return data.split('-').reverse().join('/');
      });
      setCpf(() => {
        if (associado.cpf === null) return 'Não informado';
        return associado.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      });
      setRg(() => {
        if (associado.rg === null) return 'Não informado';
        return associado.rg.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
      });
      setTelCelular(associado.tel_celular || 'Não informado');
      setWhatsapp(() => {
        if (associado.whatsapp === null) return 'Não informado';
        return associado.whatsapp ? 'Sim' : 'Não';
      });
      setTelComercial(associado.tel_comercial || 'Não informado');
      setTelResidencial(associado.tel_residencial || 'Não informado');
      setEmail(associado.email || 'Não informado');
      setEmailAlternativo(associado.email_alternativo || 'Não informado');
      setCep(() => {
        if (associado.cep === null) return 'Não informado'
        return associado.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
      });
      setRua(() => {
        if (associado.rua === null) return 'Não informado';
        return associado.rua.toString().toLowerCase().includes('rua') ? associado.rua : `Rua ${associado.rua}`;
      })
      setNumero(associado.numero || 'Não informado');
      setBairro(associado.bairro || 'Não informado');
      setEstado(associado.estado || 'Não informado');
      setCidade(associado.cidade || 'Não informado');
      setPerfil(() => {
        if (associado.perfil === null) return 'Associado';
        return capitalizeFirstLetter(associado.perfil.toString().toLowerCase());
      })
    }
  }, [associado]);
  
  function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const classes = useStyles();

  return (

    <Dialog
      open={open}
      onClose={cancel}
      aria-labelledby="dialog-title"
      maxWidth="800px"
    >
      <DialogContent
        style={{
          minWidth: '600px',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogTitle
          id="dialog-title"
          style={{
            padding: '0',
            marginBottom: '10px',
          }}
        >
          Dados do associado
        </DialogTitle>
        <Grid
          container
          spacing={2}
          style={{
            width: '100%',
            display: 'flex',
            marginBottom: '10px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <DialogContentText spacing={2} style={{ margin: '5px' }}>
            <strong>Nome Completo:</strong>
            {` ${nome} ${sobrenome}`}
          </DialogContentText>
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>Data nascimento: </strong>
            {dataNascimento}
          </DialogContentText>
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>CPF: </strong>
            {cpf}
          </DialogContentText>
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>RG: </strong>
            {rg}
          </DialogContentText>
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>Perfil: </strong>
            {perfil}
          </DialogContentText>
        </Grid>
        <DialogTitle
          id="dialog-title"
          style={{
            padding: '0',
            marginBottom: '10px',
          }}
        >
            Contato
        </DialogTitle>
        <Grid
          container
          spacing={2}
          style={{
            width: '100%',
            display: 'flex',
            marginBottom: '10px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <DialogContentText spacing={1} style={{ width: '45%', margin: '5px' }}>
            <strong>Email: </strong>
            {email}
          </DialogContentText>
          <DialogContentText spacing={1} style={{ width: '45%', margin: '5px' }}>
            <strong>Email alternativo: </strong>
            {emailAlternativo}
          </DialogContentText>
          <DialogContentText spacing={1} style={{ width: '45%', margin: '5px' }}>
            <strong>Telefone celular: </strong>
            {telCelular}
          </DialogContentText>
          <DialogContentText spacing={1} style={{ width: '45%', margin: '5px' }}>
            <strong> Whatsapp: </strong>
            {whatsapp}
          </DialogContentText>
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>Telefone residencial: </strong>
            {telResidencial}
          </DialogContentText>
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>Telefone comercial: </strong>
            {telComercial}
          </DialogContentText>
        </Grid>
        <DialogTitle
          id="dialog-title"
          style={{
            padding: '0',
            marginBottom: '10px',
          }}
        >
            Endereço
        </DialogTitle>
        <Grid
          container
          spacing={2}
          style={{
            width: '100%',
            display: 'flex',
            marginBottom: '0px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>Cidade: </strong>
            {cidade}
          </DialogContentText>
          <DialogContentText style={{ width: '45%', margin: '5px' }}>
            <strong>Estado: </strong>
            {estado}
          </DialogContentText>
          <DialogContentText spacing={2} style={{ margin: '5px', marginBottom: '0px' }}>
            <strong>Endereço Completo: </strong>
            {`${bairro}, ${rua} Nº ${numero}, CEP: ${cep}`}
          </DialogContentText>
        </Grid>
      </DialogContent>
      <DialogActions>
        <div style={{ position: 'relative', marginRight: '12px', marginBottom: '12px' }}>
          <Button
            variant="outlined"
            size="small"
            style={{
              borderColor: '#8c8c8c',
              color: '#8c8c8c',
            }}
            onClick={() => {exclude(); cancel()}}
          >
            <Delete fontSize="small" htmlColor="#8c8c8c" />
            Excluir
          </Button>

          {removing.includes(associado._id) && (
            <CircularProgress
              size={20}
              color="primary"
              thickness={4}
              className={classes.buttonProgress}
            />
          )}
        </div>
        <div style={{ position: 'relative', marginRight: '20px' , marginBottom: '12px' }}>
          <Button
            variant="outlined"
            size="small"
            disabled={accepting.includes(associado._id)}
            style={{ borderColor: '#009933', color: '#009933' }}
            onClick={() => {confirm(); cancel()}}
          >
            <Check fontSize="small" htmlColor="#009933" />
            Aceitar
          </Button>

          {accepting.includes(associado._id) && (
            <CircularProgress
              size={20}
              color="primary"
              thickness={4}
              className={classes.buttonProgress}
            />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default ModalConfirm;
