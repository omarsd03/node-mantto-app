const getMenuFrontend = (role = 'Operador') => {

    if (role == 'Responsable') {

        const menu = [{
                titulo: 'Anomalias por Resolver',
                icono: 'wrench',
                ruta: '/'
            },
            {
                titulo: 'Anomalias Resueltas',
                icono: 'faCheck',
                ruta: '/realizadas'
            },
            {
                titulo: 'Historico de Actividades',
                icono: 'faExclamationTriangle',
                ruta: '/historico'
            },
            {
                titulo: 'Acciones Planificadas',
                icono: 'faHistory',
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
                icono: 'faCheck',
                ruta: '/realizadas'
            },
            {
                titulo: 'Anomalias Reportadas',
                icono: 'faExclamationTriangle',
                ruta: '/anomalias'
            },
            {
                titulo: 'Historico de Actividades',
                icono: 'faHistory',
                ruta: '/historico'
            },
            {
                titulo: 'Acciones Planificadas',
                icono: 'faHistory',
                ruta: '/acciones'
            }
        ];

        return menu;

    }

};


module.exports = {
    getMenuFrontend
};