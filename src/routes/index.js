// Pages here
import App from '../views/app'
import RedirMV from '../views/redir'
import Salir from '../views/salir'
import Login from '../views/login/login'
import Laboratorio from '../views/laboratorio/laboratorio'
import NotificacionesLab from '../views/laboratorio/notificaciones/notificaciones'
import SubscribirCanal from '../models/subscribirCanal'
import FiltrosLab from '../views/laboratorio/notificaciones/filtros'
import NotificacionesEnviadasLab from '../views/laboratorio/notificaciones/enviadas'
import LaboratorioPedidos from '../views/laboratorio/pedidos/pedidos'
import LisaPedidosIngresados from '../views/lisa/pedidosIngresados'
import LaboratorioFlebotomista from '../views/laboratorio/flebotomista/flebotomista'
import LaboratorioFormularios from '../views/laboratorio/formularios/formularios'
import MiPerfil from '../views/perfil/perfil';
import _404 from '../views/404';
import Inicio from '../views/inicio/inicio';
import ReloadNotification from '../views/layout/reload-notificacion';
import Emergencia from '../views/emergencia/emergencia'
import EmergenciaAuxiliarPedidosLaboratorio from '../views/emergencia/auxiliar/pedidos'
import VerPedidoAuxiliarEmergencia from '../views/emergencia/auxiliar/verPedido'
import EmergenciaEnfermeriaPedidosLaboratorio from '../views/emergencia/enfermeria/pedidos'
import VerPedidoEnfermeriaEmergencia from '../views/emergencia/enfermeria/verPedido'
import Farmacia from '../views/farmacia//farmacia'
import FarmaciaRecetasAlta from '../views/farmacia//recetas/recetasAlta'
import Admisiones from '../views/admisiones/admisiones'
import PreAdmisiones from '../views/admisiones/pacientes/preadmisiones'
import Mantenimiento from '../views/mantenimiento/mantenimiento'
import IntegracionHigienizacion from '../views/mantenimiento/higienizacion/higienizacion'
import Hospitalizacion from '../views/hospitalizacion/hospitalizacion'
import Pasaportes from '../views/hospitalizacion/pasaportes/pasaportes'
import ControlCamas from '../views/hospitalizacion/controlCamas/controlCamas'
import NotificacionesPendientesLab from '../views/laboratorio/notificaciones/pendientes'
import NotificacionesErroresLab from '../views/laboratorio/notificaciones/errores'
import TRPedidos from '../views/laboratorio/notificaciones/tr'
import BSPedidos from '../views/laboratorio/notificaciones/bs'
import NSGPedidos from '../views/laboratorio/notificaciones/nsg'
import ImagenPedidos from '../views/imagen/pedidos/pedidos'
import ImagenPedido from '../views/imagen/pedidos/pedido'
import Imagen from '../views/imagen/imagen'
import HeaderPrivate from '../views/layout/header-private';


// Routes here
const Routes = {
    '/': App,
    '/subscribir/notificaciones': SubscribirCanal, //SubscribirCanal
    '/redir/mv/:idAtencion': RedirMV, //RedirMV
    '/inicio': Inicio,
    '/laboratorio': Laboratorio, //Laboratorio
    '/laboratorio/lisa/pedidos/ingresados': {
        oninit: (_data) => {
            App.isAuth('laboratorio', 16);
            document.title = "Recepción de Pedidos | " + App.title;

            if (_data.attrs.idFiltro == undefined && _data.attrs.fechaDesde == undefined) {
                return m.route.set('/laboratorio/lisa/pedidos/ingresados/', { idFiltro: 1 })
            }

            LisaPedidosIngresados.idFiltro = _data.attrs.idFiltro;


        },
        onupdate: (_data) => {

            if (_data.attrs.idFiltro !== LisaPedidosIngresados.idFiltro && LisaPedidosIngresados.idFiltro !== 1 && LisaPedidosIngresados.fechaDesde !== undefined) {
                LisaPedidosIngresados.idFiltro = _data.attrs.idFiltro;
                LisaPedidosIngresados.fechaDesde = _data.attrs.fechaDesde;
                LisaPedidosIngresados.fechaHasta = _data.attrs.fechaHasta;
                LisaPedidosIngresados.loader = true;
                LisaPedidosIngresados.pedidos = [];
                LisaPedidosIngresados.fetchPedidosIngresados();
            } else {

                if (_data.attrs.idFiltro == 1) {

                    moment.lang("es", {
                        months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
                            "_"
                        ),
                        monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split(
                            "_"
                        ),
                        weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split(
                            "_"
                        ),
                        weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"),
                        weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_"),
                    });

                    LisaPedidosIngresados.idFiltro = _data.attrs.idFiltro;
                    LisaPedidosIngresados.fechaDesde = moment().subtract(1, 'days').format('DD-MM-YYYY');
                    LisaPedidosIngresados.fechaHasta = moment().format('DD-MM-YYYY');
                    if (LisaPedidosIngresados.pedidos.length == 0) {
                        LisaPedidosIngresados.loader = true;
                        LisaPedidosIngresados.pedidos = [];
                        LisaPedidosIngresados.fetchPedidosIngresados();
                    } else {
                        LisaPedidosIngresados.loader = false;
                    }
                }
            }


        },
        view: (_data) => {
            return [
                m(HeaderPrivate, { oncreate: HeaderPrivate.setPage("laboratorio") }),
                m(LisaPedidosIngresados),
            ];
        },

    }, //Laboratorio Lisa Pedidos Ingresados
    '/laboratorio/notificaciones': NotificacionesLab, //NotificacionesLab
    '/laboratorio/notificaciones/filtros': FiltrosLab, //FiltrosLab
    '/laboratorio/notificaciones/enviadas': NotificacionesEnviadasLab, //NotificacionesEnviadasLab
    '/laboratorio/notificaciones/pendientes': NotificacionesPendientesLab, //NotificacionesPendientesLab
    '/laboratorio/notificaciones/error': NotificacionesErroresLab, //NotificacionesErroresLab
    '/laboratorio/flebotomista': LaboratorioFlebotomista, //LaboratorioFlebotomista Hospitalizacion,
    '/laboratorio/pedidos': {
        oninit: (_data) => {
            App.isAuth('laboratorio', 16);
            document.title = "Recepción de Pedidos | " + App.title;

            if (_data.attrs.idFiltro == undefined && _data.attrs.fechaDesde == undefined) {
                return m.route.set('/laboratorio/pedidos/', { idFiltro: 1 })
            }

            LaboratorioPedidos.idFiltro = _data.attrs.idFiltro;


        },
        onupdate: (_data) => {

            if (_data.attrs.idFiltro !== LaboratorioPedidos.idFiltro && LaboratorioPedidos.idFiltro !== 1 && LaboratorioPedidos.fechaDesde !== undefined) {
                LaboratorioPedidos.idFiltro = _data.attrs.idFiltro;
                LaboratorioPedidos.fechaDesde = _data.attrs.fechaDesde;
                LaboratorioPedidos.fechaHasta = _data.attrs.fechaHasta;
                LaboratorioPedidos.loader = true;
                LaboratorioPedidos.pedidos = [];
                LaboratorioPedidos.fetchPedidos();
            } else {

                if (_data.attrs.idFiltro == 1) {

                    moment.lang("es", {
                        months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
                            "_"
                        ),
                        monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split(
                            "_"
                        ),
                        weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split(
                            "_"
                        ),
                        weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"),
                        weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_"),
                    });

                    LaboratorioPedidos.idFiltro = _data.attrs.idFiltro;
                    LaboratorioPedidos.fechaDesde = moment().subtract(1, 'days').format('DD-MM-YYYY');
                    LaboratorioPedidos.fechaHasta = moment().format('DD-MM-YYYY');
                    if (LaboratorioPedidos.pedidos.length == 0) {
                        LaboratorioPedidos.loader = true;
                        LaboratorioPedidos.pedidos = [];
                        LaboratorioPedidos.fetchPedidos();
                    } else {
                        LaboratorioPedidos.loader = false;
                    }
                }
            }


        },
        view: (_data) => {
            return [
                m(HeaderPrivate, { oncreate: HeaderPrivate.setPage("laboratorio") }),
                m(LaboratorioPedidos),
            ];
        },

    }, // LaboratorioPedidos
    '/laboratorio/formularios': LaboratorioFormularios, //LaboratorioPedidos
    '/emergencia': Emergencia, //Emergencia
    '/emergencia/auxiliar/pedidos/laboratorio': EmergenciaAuxiliarPedidosLaboratorio, //EmergenciaAuxiliarPedidosLaboratorio
    '/emergencia/auxiliar/pedido/:idPedido': VerPedidoAuxiliarEmergencia, //EmergenciaAuxiliarPedidosLaboratorio
    '/emergencia/enfermeria/pedidos/laboratorio': EmergenciaEnfermeriaPedidosLaboratorio, //EmergenciaEnfermeriaPedidosLaboratorio
    '/emergencia/enfermeria/pedido/:idPedido': VerPedidoEnfermeriaEmergencia, //VerPedidoEnfermeriaEmergencia
    '/farmacia': Farmacia, //Farmacia
    '/farmacia/recetas': FarmaciaRecetasAlta, //FarmaciaRecetasAlta
    '/admisiones': Admisiones, //Admisiones
    '/admisiones/pre': PreAdmisiones, //PreAdmisiones
    '/mantenimiento': Mantenimiento, //Mantenimiento
    '/mantenimiento/higienizacion': IntegracionHigienizacion, //IntegracionHigienizacion
    '/hospitalizacion': Hospitalizacion, //Hospitalizacion
    '/hospitalizacion/pasaportes': Pasaportes, //Pasaportes
    '/hospitalizacion/control-camas': ControlCamas, //Control Camas
    '/terapia-respiratoria/pedidos': TRPedidos, //TRPedidos
    '/bco-sangre/pedidos': BSPedidos, //BSPedidos
    '/neurofisiologia/pedidos': NSGPedidos, //NSGPedidos
    '/imagen': Imagen, // Imagen
    '/imagen/pedidos': {
        oninit: (_data) => {
            App.isAuth('laboratorio', 16);
            document.title = "Recepción de Pedidos | " + App.title;

            if (_data.attrs.idFiltro == undefined && _data.attrs.fechaDesde == undefined) {
                return m.route.set('/imagen/pedidos/', { idFiltro: 1 })
            }

            ImagenPedidos.idFiltro = _data.attrs.idFiltro;


        },
        onupdate: (_data) => {

            if (_data.attrs.idFiltro !== ImagenPedidos.idFiltro && ImagenPedidos.idFiltro !== 1 && ImagenPedidos.fechaDesde !== undefined) {
                ImagenPedidos.idFiltro = _data.attrs.idFiltro;
                ImagenPedidos.fechaDesde = _data.attrs.fechaDesde;
                ImagenPedidos.fechaHasta = _data.attrs.fechaHasta;
                ImagenPedidos.loader = true;
                ImagenPedidos.pedidos = [];
                ImagenPedidos.fetchPedidos();
            } else {

                if (_data.attrs.idFiltro == 1) {

                    moment.lang("es", {
                        months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
                            "_"
                        ),
                        monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split(
                            "_"
                        ),
                        weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split(
                            "_"
                        ),
                        weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"),
                        weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_"),
                    });

                    ImagenPedidos.idFiltro = _data.attrs.idFiltro;
                    ImagenPedidos.fechaDesde = moment().subtract(1, 'days').format('DD-MM-YYYY');
                    ImagenPedidos.fechaHasta = moment().format('DD-MM-YYYY');
                    if (ImagenPedidos.pedidos.length == 0) {
                        ImagenPedidos.loader = true;
                        ImagenPedidos.pedidos = [];
                        ImagenPedidos.fetchPedidos();
                    } else {
                        ImagenPedidos.loader = false;
                    }
                }
            }


        },
        view: (_data) => {
            return [
                m(HeaderPrivate, { oncreate: HeaderPrivate.setPage("imagen") }),
                m(ImagenPedidos),
            ];
        },

    }, // ImagenPedidos
    '/imagen/pedido/': {
        onmatch: (_data) => {
            if (_data.numeroPedido !== undefined) {
                return ImagenPedido;
            } else {
                return m.route.SKIP;
            }
        }
    }, // ImagenPedidos
    '/auth': Login, // Login
    '/mi-perfil': MiPerfil, // MiPerfil
    '/salir': Salir, // Salir
    '/notificaciones': ReloadNotification, // ReloadNotificaciones
    "/:404...": _404
};


const DefaultRoute = '/';

export { Routes, DefaultRoute }