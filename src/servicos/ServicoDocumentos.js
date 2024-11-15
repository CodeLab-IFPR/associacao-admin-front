import axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoDocumento {
  static async buscarDocumentos(limite, pagina, associadoId, isAdmin = false) {
    try {
      const response = await axios.get(`${Config.api}/documentos`, {
        params: { limite, pagina, associadoId, perfil: isAdmin ? 'ADMIN' : 'ASSOCIADO' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async criarDocumento(documento) {
    try {
      const { data } = await axios.post(`${Config.api}/documentos`, documento);
      return data;
    } catch (error) {
      throw new Error('Erro ao criar documento');
    }
  }

  static async invalidarDocumento(id) {
    try {
      const { data } = await axios.put(`${Config.api}/documentos/${id}`);
      return data;
    } catch (error) {
      throw new Error('Erro ao invalidar documento');
    }
  }

  static async validarDocumento(id) {
    try {
      const { data } = await axios.put(`${Config.api}/documentos/${id}/validar`);
      return data;
    } catch (error) {
      throw new Error('Erro ao validar documento:');
    }
  }

  static async uploadDocumento(id, anexo) {
    try {
      const formData = new FormData();
      formData.append('anexo', anexo);
      await axios.post(`${Config.api}/documentos/${id}/anexo`, formData);
    } catch (error) {
      throw new Error('Erro ao fazer upload do documento:');
    }
  }

  static async downloadDocumento(id) {
    try {
      const response = await axios.get(`${Config.api}/documentos/${id}/anexo/download`, {
        responseType: 'blob',
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      throw new Error(`Falha ao fazer download do anexo: ${error.message}`);
    }
  }
}

export default ServicoDocumento;
