
const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard'),
    children: [
      {
        path: '/registro-diario',
        name: 'registro-diario',
        component: () => import('../components/RegistroDiario')
      },
      {
        path: '/estado-resultados',
        name: 'estado-resultados',
        component: () => import('../components/RegistroDiario')
      },
      {
        path: '/balance-general',
        name: 'balance-general',
        component: () => import('../components/RegistroDiario')
      },
      {
        path: '/deudas',
        name: 'deudas',
        component: () => import('../components/RegistroDiario')
      },
      {
        path: '/configuracion',
        name: 'configuracion',
        component: () => import('../components/Configuracion')
      }
      ,
      {
        path: '/perfil',
        name: 'perfil',
        component: () => import('../components/Perfil')
      }
    ]
  },
];

export default routes;