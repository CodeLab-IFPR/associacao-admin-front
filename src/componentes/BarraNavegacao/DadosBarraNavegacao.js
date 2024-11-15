import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as Bootstrap from 'react-icons/bs';
import { baseRoute } from '../../uteis/rota.json';
import ServicoAutenticacao from '../../servicos/ServicoAutenticacao';

const tamanho = 25;

const DadosBarraNavegacao = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const Servico = new ServicoAutenticacao();

  useEffect(() => {
    async function obterUsuario() {
      try {
        const usuario = await Servico.obterAssociadoLogado();
        setIsAdmin(usuario.perfil === 'ADMIN');
      } catch (error) {
        console.error('Erro ao obter o usuário logado.');
      }
    }
    obterUsuario();
  }, []);

  const itensNavegacao = [
    {
      texto: 'Página Inicial',
      rota: `${baseRoute}/inicio`,
      key: 'inicio',
      icone: <FaIcons.FaHome size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Gestão de Associados',
      rota: `${baseRoute}/associados`,
      key: 'associados',
      icone: <FaIcons.FaUserAlt size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Gestão de Eventos',
      rota: `${baseRoute}/eventos`,
      key: 'eventos',
      icone: <FaIcons.FaCalendarAlt size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Gestão de Notícias',
      rota: `${baseRoute}/noticias`,
      key: 'noticias',
      icone: <FaIcons.FaNewspaper size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Gestão de Atas',
      rota: `${baseRoute}/atas`,
      key: 'atas',
      icone: <FaIcons.FaFileAlt size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Gestão de Classificados',
      rota: `${baseRoute}/classificados`,
      key: 'classificados',
      icone: <FaIcons.FaShoppingCart size={tamanho} />,
      classe: 'nav-text',
    },
    {
      texto: 'Gestão de Fotos',
      rota: `${baseRoute}/fotos`,
      key: 'fotos',
      icone: <Bootstrap.BsFillImageFill size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Gestão de Vídeos',
      rota: `${baseRoute}/videos`,
      key: 'videos',
      icone: <Bootstrap.BsFillCameraVideoFill size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Modificar o Site',
      rota: `${baseRoute}/site`,
      key: 'site',
      icone: <FaIcons.FaGlobe size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
    {
      texto: 'Documentos',
      rota: `${baseRoute}/documentos`,
      key: 'documentos',
      icone: <FaIcons.FaAddressCard size={tamanho} />,
      classe: 'nav-text',
    },
    {
      texto: 'Mensagens',
      rota: `${baseRoute}/contato`,
      key: 'contato',
      icone: <FaIcons.FaEnvelope size={tamanho} />,
      classe: 'nav-text',
      adminOnly: true,
    },
  ];

  return itensNavegacao.filter(item => !item.adminOnly || isAdmin);
};

export default DadosBarraNavegacao;
