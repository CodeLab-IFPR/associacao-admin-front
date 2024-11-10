import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoMensagens {
  static async listarMensagens(
    limite = 10,
    pagina = 1,
    orderBy = 'dataEnvio',
    order = 'DESC',
  ) {
    const response = await Axios.get(`${Config.api}/contato`, {
      params: { limite, pagina, orderBy, order },
    });
    if (response.status !== 200) {
      throw new Error(`Erro ao buscar mensagens: ${response.statusText}`);
    }
    return response.data;
  }

  static async deletarMensagem(id) {
    try {
      const response = await Axios.delete(`${Config.api}/contato/${id}`);
      if (response.status !== 200) {
        throw new Error(`Erro ao deletar mensagem: ${response.data.error}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao deletar mensagem');
    }
  }

  static async buscarPorNomeOuAssunto(
    termo,
    limite = 10,
    pagina = 1,
    orderBy = 'dataEnvio',
    order = 'DESC',
  ) {
    const response = await Axios.get(`${Config.api}/contato/nome-assunto/${termo}`, {
      params: { limite, pagina, orderBy, order },
    });
    if (response.status !== 200) {
      throw new Error(`Erro ao buscar mensagens: ${response.statusText}`);
    }
    return response.data;
  }

  static async marcarComoLida(id) {
    try {
      const response = await Axios.put(`${Config.api}/contato/${id}/lida`);
      if (response.status !== 200) {
        throw new Error(`Erro ao marcar mensagem como lida: ${response.data.error}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao marcar mensagem como lida');
    }
  }

  static async marcarComoNaoLida(id) {
    try {
      const response = await Axios.put(`${Config.api}/contato/${id}/naolida`);
      if (response.status !== 200) {
        throw new Error(`Erro ao marcar mensagem como não lida: ${response.data.error}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Erro ao marcar mensagem como não lida',
      );
    }
  }
}

export default ServicoMensagens;
