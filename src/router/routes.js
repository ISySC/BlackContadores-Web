
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
        path: '/usuarios',
        name: 'usuarios',
        component: () => import('../components/Usuarios')
      },
      {
        path: '/cuentas',
        name: 'cuentas',
        component: () => import('../components/Cuentas')
      },
      {
        path: '/registro-diario',
        name: 'registro-diario',
        component: () => import('../components/RegistroDiario')
      },
      {
        path: '/estado-resultados',
        name: 'estado-resultados',
        component: () => import('../components/EstadoResultados')
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