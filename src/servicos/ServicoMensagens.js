import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoMensagens {
  static async listarMensagens(limite = 10, pagina = 1) {
    const response = await Axios.get(`${Config.api}/contato`, {
      params: { limite, pagina },
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

  static async buscarPorTitulo(titulo, limite = 10, pagina = 1) {
    const response = await Axios.get(`${Config.api}/contato/titulo/${titulo}`, {
      params: { limite, pagina },
    });
    if (response.status !== 200) {
      throw new Error(`Erro ao buscar mensagens: ${response.statusText}`);
    }
    return response.data;
  }
}

export default ServicoMensagens;
