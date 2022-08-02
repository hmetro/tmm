import HeaderPrivate from '../../layout/header-private';
import SidebarHospital from '../sidebarHospital';
import App from '../../app';
import m from 'mithril';

const iCama = {

    view: (_data) => {
        return [
            m("p.mg-0.d-none", [
                m("div.tx-10.mg-r-5",
                    m("i.tx-10.tx-primary.fas.fa-h-square.mg-r-5"),
                    "NHC: " + _data.attrs.HC_MV,
                )
            ]),

        ];
    },

};

const iSeccionCama = {

    view: (_data) => {
        return [
            m("p.mg-5", [
                m("span.badge.badge-light.wd-100p.tx-14",
                    "Registro de Insumos"
                ),
            ]),

        ];
    },

};

const StatusPedido = {
    error: "",
    data: [],
    dataMuestras: [],
    fetch: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        StatusPedido.error = "";
        StatusPedido.data = [];

        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/t/v1/status-pedido-lab",
                body: {
                    numeroPedido: VerPedido.numeroPedido,
                },
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then(function(result) {
                if (result.status) {

                    StatusPedido.data = result.data;
                    VerPedido.data = result.data[0];
                    VerPedido.validarStatus();

                } else {
                    StatusPedido.error = result.message;
                }

            })
            .catch(function(e) {

            })

    },


};

const Insumos = {
    tuboLila: 1,
    tuboRojo: 1,
    tuboCeleste: 1,
    tuboNegro: 1,
    tuboVerde: 1,
    gsav: 1,
    hemocultivo: 1,
    qtb: 1
};

const DetallePedido = {
    checkedAll: false,
    seleccionarTodos: (status) => {

        DetallePedido.checkedAll = status;
        var _fechaToma = moment().format('DD-MM-YYYY HH:mm');


        return StatusPedido.data.map(function(_val, _i, _contentData) {
            if (status) {
                StatusPedido.data[_i]['STATUS_TOMA'] = _fechaToma;
                StatusPedido.data[_i]['customCheked'] = true;
                DetallePedido.udpateStatusTomaMuestra(StatusPedido.data[_i]['CD_EXA_LAB'], 1);

            } else {
                StatusPedido.data[_i]['STATUS_TOMA'] = "";
                StatusPedido.data[_i]['customCheked'] = false;
                DetallePedido.udpateStatusTomaMuestra(StatusPedido.data[_i]['CD_EXA_LAB'], 2);


            }
        })
    },
    udpateStatusTomaMuestra: (cod_exa_lab, sts) => {
        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/t/v1/up-status-pedido-lab",
                body: {
                    numeroPedido: VerPedido.numeroPedido,
                    cod_exa_lab: cod_exa_lab,
                    sts: sts
                },
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then(function(result) {
                console.log(result)
                VerPedido.validarStatus();
            })
            .catch(function(e) {})
    },

    view: () => {




        if (StatusPedido.error) {
            return [
                m("p.mg-0",
                    StatusPedido.error
                )
            ]
        } else if (StatusPedido.data.length !== 0) {
            return [
                m("div.bg-white.bd.pd-20.pd-lg-30.d-flex.flex-column.justify-content-end", [
                    m("div.mg-b-30",
                        m("i.tx-60.fas.fa-file." + VerPedido.classPedido)
                    ),

                    m("h5.tx-inverse.mg-b-10",
                        "Detalle de Pedido N°: " + VerPedido.numeroPedido + " - Status: " + VerPedido.descSstatusPedido
                    ),
                    ((VerPedido.data.TIPO_PEDIDO == 'R') ? [
                        m("span.pd-6.wd-100p.wd-md-20p", {
                            class: "badge badge-primary mg-b-2 mg-r-2",
                        }, [
                            m("i.fas.fa-file-alt.mg-r-5"),
                        ], "Pedido Normal"),

                    ] : [
                        m("span.pd-6.wd-100p.wd-md-20p", {
                            class: "badge badge-danger mg-b-2 mg-r-2 ",
                        }, [
                            m("i.fas.fa-file-alt.mg-r-5"),
                        ], "Pedido Urgente"),
                    ]),
                    m("p.mg-5.tx-20.mg-t-10", [
                        m("i.fas.fa-user.mg-r-8.text-secondary"),
                        VerPedido.data.PTE_MV

                    ]),
                    m("p.mg-5.tx-15", [
                        "Fecha Pedido: ",
                        VerPedido.data.FECHA_TOMA

                    ]),
                    m("p.mg-5.tx-15", [
                        "Médico: ",
                        VerPedido.data.MED_MV,

                    ]),
                    m("p.mg-5.tx-15", [
                        "Ubicaciòn: ",
                        VerPedido.data.SECTOR,
                        ": ",
                        VerPedido.data.CAMA,

                    ]),
                    m("p.mg-5", [
                        "Historía Clínica: ",



                    ]),
                    m("p.mg-5", [
                        m("span.badge.badge-primary.mg-r-5.tx-14",
                            "GEMA: " + VerPedido.data.HC_MV + "01",
                        ),
                        m("span.badge.badge-success.mg-r-5.tx-14",
                            "MV: " + VerPedido.data.HC_MV
                        ),
                    ]),
                    m("ul.nav.nav-tabs.mg-t-15[id='myTab'][role='tablist']", [
                        m("li.nav-item",
                            m("a.nav-link.active[id='home-tab'][data-toggle='tab'][href='#home'][role='tab'][aria-controls='home'][aria-selected='true']",
                                "Detalle Pedido"
                            )
                        ),
                        m("li.nav-item",
                            m("a.nav-link[id='profile-tab'][data-toggle='tab'][href='#profile'][role='tab'][aria-controls='profile'][aria-selected='false']",
                                "Toma de Muestras"
                            )
                        ),

                    ]),
                    m(".tab-content.bd.bd-gray-300.bd-t-0.pd-20.mg-t-10[id='myTabContent']", [
                        m(".tab-pane.fade.show.active[id='home'][role='tabpanel'][aria-labelledby='home-tab']", [
                            (StatusPedido.error ? [
                                m("p.mg-0",
                                    StatusPedido.error
                                )
                            ] : StatusPedido.data !== undefined && StatusPedido.data.length !== 0 ? [
                                m("h6",
                                    "Detalle Pedido:"
                                ),
                                m("div.table-responsive",
                                    m("table.table.table-dashboard.mg-b-0", [
                                        m("thead",
                                            m("tr", [
                                                m("th",
                                                    "FECHA PROGRAMADA"
                                                ),
                                                m("th",
                                                    "FECHA TOMA MUESTRA"
                                                ),
                                                m("th",
                                                    "FECHA RECEP. LAB."
                                                ),
                                                m("th.text-right",
                                                    "EXAMEN"
                                                ),
                                            ])
                                        ),
                                        m("tbody", [
                                            StatusPedido.data.map(function(_val, _i, _contentData) {
                                                return [
                                                    m("tr", [
                                                        m("td.tx-color-03.tx-normal",
                                                            _val.FECHA_TOMA + " " + _val.HORA_TOMA
                                                        ),
                                                        m("td.tx-color-03.tx-normal",
                                                            (_val.STATUS_TOMA.length !== 0) ? _val.STATUS_TOMA : "Pendiente"
                                                        ),
                                                        m("td.tx-color-03.tx-normal",
                                                            (_val.STATUS_TOMA.length !== 0) ? _val.STATUS_TOMA : "Pendiente"
                                                        ),
                                                        m("td.tx-medium.text-right",
                                                            _val.NM_EXA_LAB
                                                        ),



                                                    ]),
                                                ]
                                            })
                                        ])
                                    ])
                                )


                            ] : m("div.placeholder-paragraph.wd-100p", [
                                m("div.line"),
                                m("div.line")
                            ]))
                        ]),
                        m(".tab-pane.fade[id='profile'][role='tabpanel'][aria-labelledby='profile-tab']", [
                            m("p.mg-5", [
                                m("span.badge.badge-light.wd-100p.tx-14",
                                    "Registro de Toma de Muestras"
                                ),
                            ]),
                            m("div.table-responsive.mg-b-10.mg-t-10",
                                m("table.table.table-dashboard.table-hover.mg-b-0", [
                                    m("thead",
                                        m("tr", [
                                            m("th.text-left",
                                                "EXAMEN"
                                            ),
                                            m("th",
                                                "FECHA DE TOMA DE MUESTRA"
                                            ),

                                        ])
                                    ),
                                    m("tbody", [
                                        m("tr.d-none", [
                                            m("td.tx-normal",
                                                m("div.custom-control.custom-checkbox", [
                                                    m("input.custom-control-input[type='checkbox'][id='selectTomaTodos']", {

                                                        checked: DetallePedido.checkedAll,
                                                        onclick: function(e) {
                                                            DetallePedido.seleccionarTodos(this.checked);
                                                        }


                                                    }),
                                                    m("label.custom-control-label[for='selectTomaTodos']",
                                                        'Seleccionar Todos'
                                                    )
                                                ])
                                            ),
                                            m("td.tx-medium.text-right", ),
                                        ]),

                                        StatusPedido.data.map(function(_val, _i, _contentData) {


                                            return [
                                                m("tr", [

                                                    m("td.tx-18.tx-medium.text-left",
                                                        _val.NM_EXA_LAB
                                                    ),

                                                    m("td.tx-16.tx-normal",
                                                        m("div.custom-control.custom-checkbox.tx-16", [
                                                            m("input.custom-control-input.tx-16[type='checkbox'][id='" + _val.CD_EXA_LAB + "']", {
                                                                checked: StatusPedido.data[_i]['customCheked'],
                                                                onupdate: function(e) {
                                                                    this.checked = StatusPedido.data[_i]['customCheked'];
                                                                },
                                                                onclick: function(e) {

                                                                    e.preventDefault();

                                                                    var p = this.checked;



                                                                    StatusPedido.data[_i]['customCheked'] = !StatusPedido.data[_i]['customCheked'];

                                                                    if (p) {
                                                                        this.checked = true;
                                                                        StatusPedido.data[_i]['STATUS_TOMA'] = moment().format('DD-MM-YYYY HH:mm');
                                                                        DetallePedido.udpateStatusTomaMuestra(_val.CD_EXA_LAB, 1);

                                                                    } else {
                                                                        this.checked = false;;

                                                                        DetallePedido.checkedAll = false;
                                                                        StatusPedido.data[_i]['STATUS_TOMA'] = "";
                                                                        DetallePedido.udpateStatusTomaMuestra(_val.CD_EXA_LAB, 2);
                                                                    }



                                                                },



                                                            }),
                                                            m("label.custom-control-label.tx-16[for='" + _val.CD_EXA_LAB + "']",
                                                                (StatusPedido.data[_i]['STATUS_TOMA'].length !== 0) ? StatusPedido.data[_i]['STATUS_TOMA'] : StatusPedido.data[_i]['STATUS_TOMA'],

                                                            )
                                                        ])
                                                    ),



                                                ]),
                                            ]





                                        })


                                    ])
                                ])
                            ),
                            m("p.mg-5", [
                                m("span.badge.badge-light.wd-100p.tx-14",
                                    "Registro de Insumos"
                                ),
                            ]),
                            m("div.table-responsive.mg-b-10.mg-t-10",
                                m("table.table.table-dashboard.table-hover.mg-b-0", [
                                    m("thead",
                                        m("tr", [
                                            m("th.text-left",
                                                "INSUMOS"
                                            ),
                                            m("th.text-left",
                                                "CANTIDAD"
                                            ),
                                        ])
                                    ),
                                    m("tbody", [

                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='tuboLila']"),
                                                    m("label.tx-20.tx-semibold.custom-control-label[for='tuboLila']",
                                                        "Tubo Lila"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.tuboLila;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.tuboLila;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboLila++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboLila--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),




                                        ]),

                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='tuboRojo']"),
                                                    m("label.tx-20.tx-semibold..custom-control-label[for='tuboRojo']",
                                                        "Tubo Rojo"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.tuboRojo;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.tuboRojo;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboRojo++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboRojo--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),




                                        ]),
                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='tuboCeleste']"),
                                                    m("label.tx-20.tx-semibold..custom-control-label[for='tuboCeleste']",
                                                        "Tubo Celeste"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.tuboCeleste;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.tuboCeleste;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboCeleste++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboCeleste--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),




                                        ]),
                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='tuboNegro']"),
                                                    m("label.tx-20.tx-semibold..custom-control-label[for='tuboNegro']",
                                                        "Tubo Negro"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.tuboNegro;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.tuboNegro;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboNegro++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboNegro--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),


                                        ]),
                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='tuboVerde']"),
                                                    m("label.tx-20.tx-semibold..custom-control-label[for='tuboVerde']",
                                                        "Tubo Verde"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.tuboVerde;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.tuboVerde;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboVerde++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.tuboVerde--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),




                                        ]),
                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='gsav']"),
                                                    m("label.tx-20.tx-semibold..custom-control-label[for='gsav']",
                                                        "GSA V"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.gsav;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.gsav;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.gsav++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.gsav--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),





                                        ]),
                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='hemocultivo']"),
                                                    m("label.tx-20.tx-semibold..custom-control-label[for='hemocultivo']",
                                                        "Hemocultivo"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.hemocultivo;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.hemocultivo;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.hemocultivo++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.hemocultivo--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),




                                        ]),
                                        m("tr", [

                                            m("td.tx-16.tx-normal",
                                                m("div.custom-control.custom-checkbox.tx-16", [
                                                    m("input.tx-20.custom-control-input[type='checkbox'][id='qtb']"),
                                                    m("label.tx-20.tx-semibold..custom-control-label[for='qtb']",
                                                        "QTB"
                                                    )
                                                ])
                                            ),

                                            m("td.tx-16.tx-medium.text-left", [
                                                m(".btn-group.btn-group-sm.tx-16[role='group']", {

                                                }, [
                                                    m("button.btn[type='button']",
                                                        m("div.tx-20.tx-semibold.bg-gray-300.pd-l-5.pd-r-5", {
                                                            oncreate: (el) => {
                                                                el.dom.innerText = Insumos.qtb;
                                                            },
                                                            onupdate: (el) => {
                                                                el.dom.innerText = Insumos.qtb;
                                                            }

                                                        })
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.qtb++;
                                                            },

                                                        },
                                                        m("i.fas.fa-plus-circle.tx-22.tx-success")
                                                    ),
                                                    m("button.btn.btn[type='button']", {
                                                            onclick: () => {
                                                                Insumos.qtb--;

                                                            },

                                                        },
                                                        m("i.fas.fa-minus-circle.tx-22.tx-danger")
                                                    ),

                                                ])
                                            ]),




                                        ]),
                                    ])
                                ])
                            ),
                        ]),

                    ]),

                ])
            ]
        } else {
            return [
                m("div.pd-t-10", [
                    m("div.placeholder-paragraph.wd-100p", [
                        m("div.line"),
                        m("div.line")
                    ])
                ])

            ]
        }

    }

};

const VerPedido = {
    numeroPedido: "",
    numeroHistoriaClinica: "",
    track: "",
    data: [],
    classPedido: "",
    descSstatusPedido: "",
    validarStatus: () => {


        for (var i = 0; i < StatusPedido.data.length; i++) {
            if (StatusPedido.data[i]['STATUS_TOMA'].length !== 0) {
                StatusPedido.data[i]['customCheked'] = true;
            }
        }

        var _r = 0;
        var _t = 0;

        for (var i = 0; i < StatusPedido.data.length; i++) {

            if (StatusPedido.data[i]['STATUS_RESULTADO'].length !== 0) {
                _r++;
            }

            if (StatusPedido.data[i]['STATUS_TOMA'].length !== 0) {
                _t++;
            }

        }

        // Set State

        if (StatusPedido.data.length !== _t && StatusPedido.data.length !== _r) {
            VerPedido.classPedido = "tx-warning"
            VerPedido.descSstatusPedido = "Muestras Pendientes";
        }

        if (StatusPedido.data.length == _t && StatusPedido.data.length !== _r) {
            DetallePedido.checkedAll = true;
            VerPedido.classPedido = "tx-orange"
            VerPedido.descSstatusPedido = "Pendiente Resultado";
        }

        if (StatusPedido.data.length == _t && StatusPedido.data.length == _r) {
            DetallePedido.checkedAll = true;
            VerPedido.classPedido = "tx-success"
            VerPedido.descSstatusPedido = "Finalizado - Gestionado";
        }


        /*

        if (_t == StatusPedido.data.length) {
            DetallePedido.checkedAll = true;
            VerPedido.classPedido = "tx-orange";
            VerPedido.descSstatusPedido = "Pendiente Resultado";
            $("#pedido_" + VerPedido.numeroPedido).parent().parent().remove();

        }


        */








    },
    view: () => {

        return [

            m("div.animated.fadeInUp", {
                class: (ControlCamas.showBitacora.length !== 0 ? "" : "d-none")
            }, [
                m(DetallePedido)
            ])

        ]

    },

};

const ControlCamas = {
    notificaciones: [],
    ControlCamas: [],
    showBitacora: "",
    soloGema: 0,
    pendienteAlta: 0,
    oninit: (_data) => {
        if (isObjEmpty(_data.attrs)) {
            ControlCamas.showBitacora = "";
        } else {
            ControlCamas.showBitacora = "d-none";
            VerPedido.numeroPedido = _data.attrs.numeroPedido;
        }
        HeaderPrivate.page = "";
        SidebarHospital.page = "";
        App.isAuth('hospitalizacion', 17);
        console.log(ControlCamas)
    },

    oncreate: (_data) => {
        document.title = "Caja Recepción Turnos | " + App.title;
        if (isObjEmpty(_data.attrs)) {
            loadControlCamas();
        } else {
            StatusPedido.fetch();
        }
    },
    onupdate: (_data) => {
        if (isObjEmpty(_data.attrs)) {
            ControlCamas.showBitacora = "";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            ControlCamas.showBitacora = "d-none";
        }
    },
    view: (_data) => {

        var _fechaHoy_ = moment().format('DD-MM-YYYY');


        if (isObjEmpty(_data.attrs)) {
            ControlCamas.showBitacora = "";
        } else {
            ControlCamas.showBitacora = "d-none";
        }

        return [
            m(HeaderPrivate, { oncreate: HeaderPrivate.setPage("hospitalizacion") }),
            m(SidebarHospital, { oncreate: SidebarHospital.setPage(17) }),
            m("div.content.content-components",
                m("div.container", [
                    m("ol.breadcrumb.df-breadcrumbs.mg-b-10", [
                        m("li.breadcrumb-item",
                            m(m.route.Link, { href: "/" }, [
                                " Metrovirtual "
                            ])
                        ),
                        m("li.breadcrumb-item",
                            m(m.route.Link, { href: "/hospitalizacion" }, [
                                " Hospitalización "
                            ])

                        ),
                        m("li.breadcrumb-item.active[aria-current='page']",
                            "Control de Camas GEMA-MV"
                        ),

                    ]),
                    m("h1.df-title.mg-t-20.mg-b-10",
                        "Control de Camas GEMA-MV:"
                    ),

                    m("p.mg-b-20.tx-14", {
                            class: (_data.attrs.numeroPedido == undefined) ? "" : "d-none"

                        }, [
                            m("i.fas.fa-info-circle.mg-r-5.text-secondary"),
                            "Buscar por apellidos y nombres de paciente, historia clínica y número de pedido.",

                        ]

                    ),



                    m("div.row.animated.fadeInUp", {
                        class: ControlCamas.showBitacora
                    }, [
                        m("div.col-12.mg-b-5.wd-100p.d-none[data-label='Filtrar'][id='filterTable']",

                            m("div.row", [

                                m("div.col-sm-12.pd-b-10",
                                    m("div.input-group", [
                                        m(".df-example.demo-forms.wd-100p[data-label='Buscar']", [
                                            m("input.form-control[type='text'][id='searchField'][data-role='tagsinput']", {
                                                oncreate: () => {


                                                    var citynames = new Bloodhound({
                                                        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
                                                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                                                    });


                                                },

                                            }),
                                        ])
                                    ])
                                ),


                            ])
                        ),
                        m("div.col-12", [

                            m("div.table-loader.wd-100p",
                                m("div.placeholder-paragraph", [
                                    m("div.line"),
                                    m("div.line")
                                ])
                            ),
                            m("div.table-content.col-12.pd-r-0.pd-l-0.pd-b-20.", [
                                m("div.mg-b-10.d-flex.align-items-center.justify-content-between", [
                                    m("h5.mg-b-0",
                                        "Control de Camas GEMA-MV: "
                                    ),
                                    m("div.tx-15.d-none", [
                                        m("a.link-03.lh-0[href='']",
                                            m("i.icon.ion-md-refresh"),
                                            " Actualizar"
                                        ),

                                    ])
                                ]),
                                m("table.table.table-xs[id='table-control-camas'][width='100%']"),


                            ])
                        ])
                    ]),
                    m(VerPedido)
                ])
            ),
            m("div.section-nav", [
                m("label.nav-label",
                    "Control de Camas"
                ),
                m("div.mg-t-10.bg-white",
                    m("div.col-12.mg-t-30.mg-lg-t-0",
                        m("div.row", [
                            m("div.col-sm-6.col-lg-12.mg-t-30.mg-sm-t-0.mg-lg-t-30", [

                                m("div.d-flex.align-items-center.justify-content-between.mg-b-5", [
                                    m("h6.tx-uppercase.tx-10.tx-spacing-1.tx-color-02.tx-semibold.mg-b-0",
                                        "Alta MV"
                                    ),
                                    m("span.tx-10.tx-color-04",
                                        "Hoy, " + _fechaHoy_
                                    )
                                ]),
                                m("div.d-flex.align-items-end.justify-content-between.mg-b-5", [
                                    (ControlCamas.pendienteAlta == 0) ? [m("h5.tx-normal.tx-rubik.lh-2.mg-b-0", "0 Pacientes"), ] : [m("h5.tx-normal.tx-rubik.lh-2.mg-b-0", {
                                        oncreate: (el) => {
                                            el.dom.innerText = ControlCamas.pendienteAlta + " Pacientes";
                                        },
                                        onupdate: (el) => {
                                            el.dom.innerText = ControlCamas.pendienteAlta + " Pacientes";
                                        }
                                    }), ]
                                ]),
                                (ControlCamas.pendienteAlta == 0) ? [m("div.progress.ht-4.mg-b-0.op-5",
                                    m(".progress-bar.bg-danger.wd-0p[role='progressbar'][aria-valuenow='100'][aria-valuemin='0'][aria-valuemax='100']")
                                )] : [m("div.progress.ht-4.mg-b-0.op-5",
                                    m(".progress-bar.bg-danger.wd-100p[role='progressbar'][aria-valuenow='100'][aria-valuemin='0'][aria-valuemax='100']")
                                )],

                            ]),
                            m("div.col-sm-6.col-lg-12.mg-t-30.mg-sm-t-0.mg-lg-t-30", [

                                m("div.d-flex.align-items-center.justify-content-between.mg-b-5", [
                                    m("h6.tx-uppercase.tx-10.tx-spacing-1.tx-color-02.tx-semibold.mg-b-0",
                                        "Solo GEMA"
                                    ),
                                    m("span.tx-10.tx-color-04",
                                        "Hoy, " + _fechaHoy_
                                    )
                                ]),
                                m("div.d-flex.align-items-end.justify-content-between.mg-b-5", [
                                    (ControlCamas.soloGema == 0) ? [m("h5.tx-normal.tx-rubik.lh-2.mg-b-0", "0 Pacientes"), ] : [m("h5.tx-normal.tx-rubik.lh-2.mg-b-0", {
                                        oncreate: (el) => {
                                            el.dom.innerText = ControlCamas.soloGema + " Pacientes";
                                        },
                                        onupdate: (el) => {
                                            el.dom.innerText = ControlCamas.soloGema + " Pacientes";
                                        }
                                    }), ]
                                ]),
                                (ControlCamas.soloGema == 0) ? [m("div.progress.ht-4.mg-b-0.op-5",
                                    m(".progress-bar.bg-danger.wd-0p[role='progressbar'][aria-valuenow='100'][aria-valuemin='0'][aria-valuemax='100']")
                                )] : [m("div.progress.ht-4.mg-b-0.op-5",
                                    m(".progress-bar.bg-teal.wd-100p[role='progressbar'][aria-valuenow='100'][aria-valuemin='0'][aria-valuemax='100']")
                                )],
                            ]),


                        ])
                    )
                )
            ])

        ];
    },

};

function loadControlCamas() {

    $(".table-content").hide();
    $(".table-loader").show();

    // MOMMENT
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

    $.fn.dataTable.ext.errMode = "none";
    var table = $("#table-control-camas").DataTable({
        "ajax": {
            url: "https://api.hospitalmetropolitano.org/t/v1/adm-control-camas",
            dataSrc: "data",
            serverSide: true,
        },
        processing: true,
        serverSide: true,
        responsive: false,
        dom: 't',
        language: {
            searchPlaceholder: "Buscar...",
            sSearch: "",
            lengthMenu: "Mostrar _MENU_ registros por página",
            sProcessing: "Procesando...",
            sZeroRecords: "Todavía no tienes resultados disponibles.",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior",
            },
            oAria: {
                sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente",
            },
        },
        cache: false,
        order: false,
        columns: false,
        aoColumnDefs: [{
                mRender: function(data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
                visible: false,
                aTargets: [0],
                orderable: false,
            },
            {
                mRender: function(data, type, full) {
                    return full.HC_MV;
                },
                visible: false,
                aTargets: [1],
                orderable: false,

            },
            {
                mRender: function(data, type, full) {
                    return full.PTE_MV;

                },
                visible: false,
                aTargets: [2],
                orderable: false,

            },
            {
                mRender: function(data, type, full) {
                    return "";
                },
                visible: true,
                aTargets: [3],
                width: "100%",
                orderable: false,

            },


        ],
        fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {},
        drawCallback: function(settings) {

            $(".table-content").show();
            $(".table-loader").hide();

            settings.aoData.map(function(_i) {

                if (_i._aData.TIPO == 'SOLO GEMA') {
                    ControlCamas.soloGema++;
                }

                m.mount(_i.anCells[3], {
                    view: function() {
                        return [
                            ControlCamas.soloGema == 1 ? m(iSeccionCama, _i._aData) : "",
                            m(iCama, _i._aData)
                        ]
                    }
                });

                // m.mount(_i.anCells[3], { view: function() { return m(iCama, _i._aData) } });

            })

            m.redraw.sync();

        },
    }).on('xhr.dt', function(e, settings, json, xhr) {
        // Do some staff here...
        $('.table-loader').hide();
        $('.table-content').show();
    }).on('page.dt', function(e, settings, json, xhr) {
        // Do some staff here...
        $('.table-loader').show();
        $('.table-content').hide();
    });

    $('.dataTables_length select').select2({
        minimumResultsForSearch: Infinity
    });

    $('#searchField').change(function(e) {
        $('.table-loader').show();
        $('.table-content').hide();
        table.search($('#searchField').val()).draw();
    });

    return table;



}

function loadPendientesAlta() {


    // MOMMENT
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

    $.fn.dataTable.ext.errMode = "none";
    var table = $("#table-notificaciones").DataTable({
        data: ControlCamas.dataPendientesAlta,
        dom: 't',
        language: {
            searchPlaceholder: "Buscar...",
            sSearch: "",
            lengthMenu: "Mostrar _MENU_ registros por página",
            sProcessing: "Procesando...",
            sZeroRecords: "Sin Notificaciones",
            sEmptyTable: "Sin Notificaciones",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior",
            },
            oAria: {
                sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente",
            },
        },
        cache: false,
        order: false,
        destroy: true,

        columns: false,
        aoColumnDefs: [{
                mRender: function(data, type, row, meta) {
                    return "";
                },
                visible: true,
                width: "100%",
                aTargets: [0],
                orderable: false,
            },

        ],
        fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {},
        drawCallback: function(settings) {
            settings.aoData.map(function(_v, _i) {
                m.mount(_v.anCells[0], {
                    view: function() {
                        if (_v._aData.title == 'Nuevo Mensaje') {
                            return m("div.demo-static-toast",
                                m(".toast[role='alert'][aria-live='assertive'][aria-atomic='true']", {
                                    "style": { "max-width": "none" }
                                }, [
                                    m("div.toast-header.bg-primary", [
                                        m("small.tx-white.tx-5.mg-b-0.mg-r-auto",
                                            _v._aData.title
                                        ),
                                        m("small.tx-white",
                                            moment.unix(_v._aData.timestamp).format("HH:mm")
                                        ),
                                    ]),
                                    m("div.toast-body.small",
                                        _v._aData.message
                                    )
                                ])
                            )
                        } else {
                            return m("div.demo-static-toast",
                                m(".toast[role='alert'][aria-live='assertive'][aria-atomic='true']", {
                                    "style": { "max-width": "none" }
                                }, [
                                    m("div.toast-header.bg-danger", [
                                        m("small.tx-white.tx-5.mg-b-0.mg-r-auto",
                                            _v._aData.title
                                        ),
                                        m("small.tx-white",
                                            moment.unix(_v._aData.timestamp).format("HH:mm")
                                        ),
                                    ]),
                                    m("div.toast-body.small",
                                        _v._aData.message
                                    )
                                ])
                            )
                        }

                    }
                });


            })
        },
    });


    return table;

};



function isObjEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
}


export default ControlCamas;