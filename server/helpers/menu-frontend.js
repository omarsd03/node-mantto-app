const getMenuFrontend = (role = 'Operador') => {

    if (role == 'Responsable') {

        const menu = [{
                titulo: 'Anomalias por Resolver',
                icono: 'faWrench'
            },
            {
                titulo: 'Anomalias Resueltas',
                icono: 'faCheck'
            },
            {
                titulo: 'Historico de Actividades',
                icono: 'faExclamationTriangle'
            }
        ];

        return menu;

    } else {

        menu = [{
                titulo: 'Actividades Pendientes',
                icono: 'faWrench'
            },
            {
                titulo: 'Actividades Realizadas',
                icono: 'faCheck'
            },
            {
                titulo: 'Anomalias Reportadas',
                icono: 'faExclamationTriangle'
            },
            {
                titulo: 'Historico de Actividades',
                icono: 'faHistory'
            }
        ];

        return menu;

    }

};


module.exports = {
    getMenuFrontend
};