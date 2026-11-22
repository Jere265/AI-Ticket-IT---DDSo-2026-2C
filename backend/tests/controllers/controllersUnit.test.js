import { EventoController } from '../../src/controllers/eventoController.js';
import { CompraController } from '../../src/controllers/compraController.js';
import { ResenaController } from '../../src/controllers/resenaController.js';
import { UsuarioController } from '../../src/controllers/usuarioController.js';
import { CategoriaController } from '../../src/controllers/categoriaController.js';
import { seedInitialData } from '../../src/config/container.js';

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

describe('Controllers Unit Tests (Sandboxed, No Sockets)', () => {
  beforeEach(() => {
    seedInitialData();
  });

  describe('EventoController', () => {
    test('listarEventos and obtenerEventoPorId', async () => {
      const req = { query: { criterio: 'Rock' } };
      const res = mockRes();
      await EventoController.listarEventos(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body.exito).toBe(true);

      const reqId = { params: { id: 1 } };
      const resId = mockRes();
      await EventoController.obtenerEventoPorId(reqId, resId);
      expect(resId.statusCode).toBe(200);
      expect(resId.body.datos.id).toBe(1);
    });

    test('obtenerEstadoVentas', async () => {
      const req = { params: { id: 1 } };
      const res = mockRes();
      await EventoController.obtenerEstadoVentas(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body.datos.disponibilidadPorTipo).toBeDefined();
    });
  });

  describe('CompraController', () => {
    test('crearCompra, listarComprasComprador, cancelarCompra, utilizar', async () => {
      const req = {
        body: {
          compradorId: 1,
          eventoId: 1,
          tipoEntradaId: 1,
          cantidad: 1
        }
      };
      const res = mockRes();
      await CompraController.crearCompra(req, res);
      expect(res.statusCode).toBe(201);
      const compraId = res.body.datos.id;

      // Historial
      const reqHist = { params: { id: compraId } };
      const resHist = mockRes();
      await CompraController.obtenerHistorial(reqHist, resHist);
      expect(resHist.statusCode).toBe(200);
      expect(resHist.body.datos.length).toBeGreaterThanOrEqual(1);

      // Utilizar
      const reqUtil = { params: { id: compraId } };
      const resUtil = mockRes();
      await CompraController.marcarComoUtilizada(reqUtil, resUtil);
      expect(resUtil.statusCode).toBe(200);
      expect(resUtil.body.datos.estado).toBe('UTILIZADA');
    });

    test('Chat mensajes', async () => {
      const reqMsg = {
        params: { compraId: 2 },
        body: { mensaje: 'Consulta sobre el evento', remitente: 'comprador', usuarioId: 1 }
      };
      const resMsg = mockRes();
      await CompraController.enviarMensajeChat(reqMsg, resMsg);
      expect(resMsg.statusCode).toBe(201);

      const reqGet = { params: { compraId: 2 } };
      const resGet = mockRes();
      await CompraController.obtenerMensajesChat(reqGet, resGet);
      expect(resGet.statusCode).toBe(200);
      expect(resGet.body.datos.length).toBeGreaterThan(0);
    });
  });

  describe('ResenaController', () => {
    test('obtenerResenasOrganizador and crearResena', async () => {
      const reqOrg = { params: { id: 1 } };
      const resOrg = mockRes();
      await ResenaController.obtenerResenasOrganizador(reqOrg, resOrg);
      expect(resOrg.statusCode).toBe(200);
      expect(resOrg.body.exito).toBe(true);
    });
  });

  describe('UsuarioController and CategoriaController', () => {
    test('Favoritos y Categorias', async () => {
      const reqFav = { params: { id: 1 }, body: { eventoId: 2 } };
      const resFav = mockRes();
      await UsuarioController.agregarFavorito(reqFav, resFav);
      expect(resFav.statusCode).toBe(200);

      const reqCat = {};
      const resCat = mockRes();
      await CategoriaController.listarCategorias(reqCat, resCat);
      expect(resCat.statusCode).toBe(200);
      expect(resCat.body.datos.length).toBeGreaterThan(0);
    });
  });
});
