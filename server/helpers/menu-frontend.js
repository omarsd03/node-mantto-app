const getMenuFrontend = (role = 'Operador') => {

    if (role == 'Responsable') {

        const menu = [{
                titulo: 'Anomalias por Resolver',
                icono: 'wrench',
                ruta: '/'
            },
            {
                titulo: 'Anomalias Resueltas',
                icono: 'check',
                ruta: '/realizadas'
            },
            {
                titulo: 'Historico de Anomalias',
                icono: 'history',
                ruta: '/historico'
            },
            {
                titulo: 'Acciones Planificadas',
                icono: 'clipboard-list',
                ruta: '/acciones'
            }
        ];

        return menu;

    } else {

        menu = [{
                titulo: 'Actividades Pendientes',
                icono: 'wrench',
                ruta: '/'
            },
            {
                titulo: 'Actividades Realizadas',
                icono: 'check',
                ruta: '/realizadas'
            },
            {
                titulo: 'Anomalias Reportadas',
                icono: 'exclamation-triangle',
                ruta: '/anomalias'
            },
            {
                titulo: 'Historico de Actividades',
                icono: 'history',
                ruta: '/historico'
            },
            {
                titulo: 'Acciones Planificadas',
                icono: 'clipboard-list',
                ruta: '/acciones'
            }
        ];

        return menu;

    }

};


module.exports = {
    getMenuFrontend
};