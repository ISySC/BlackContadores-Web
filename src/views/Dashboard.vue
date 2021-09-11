<template>
  <!-- App.vue -->
  <div id="app">
    <v-app id="inspire">
      <!-- mostrar pantalla alerta para mensajes -->
      <AlertDialog
        titulo="Black Administrativo - [ Configuración de Perfil ]"
        :mensaje="mensaje"
        :esCancelar="false"
        :esAceptar="true"
        vToolBarColor="indigo"
        :dialog.sync="dialogAlert"
      />
      <!-- -->
      <v-navigation-drawer v-model="drawer" sm="absolute" left app>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title id="navigationTitle">
              {{ str_title_name_app }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ str_slogan }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider style="margin-bottom: 20px"></v-divider>

        <v-list dense nav>
          <v-list-item-group color="blue">
            <v-list-item
              :to="item.path"
              v-for="item in menu"
              :key="item.title"
              link
              id="btnLnk"
              :disabled="!activa"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  class="text-subtitle-1 font-weight-regular"
                  >{{ item.title }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-footer app style="padding: 0px">
          <v-btn block tile color="blue" dark href="/" style="height: 60px">
            <v-icon left> mdi-logout </v-icon>
            Cerrar Sesión
          </v-btn>
        </v-footer>
      </v-navigation-drawer>

      <v-app-bar dark id="appBarStyle" app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span id="spanTitle"
          >BUEN DÍA {{ str_legal_name }}
          <span id="spanSubtitle">{{ str_company_name }}</span></span
        >
        <div
          v-on:click="details($event)"
          style="cursor: pointer"
          v-if="value < 100"
        >
          <v-subheader
            >Tu perfil se encuentra configurado al {{ value }}%</v-subheader
          >
          <v-progress-linear
            color="cyan"
            buffer-value="1"
            :value="value"
            stream
          ></v-progress-linear>
        </div>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
      <v-footer app>
        <ContentFooter />
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import ContentFooter from "../components/ContentFooter";
import Constants from "../util/constants";
import Utils from "../util/utils";
import AlertDialog from "../components/AlertDialog";
import CompanyServices from "../network/services/CompanyService";

export default {
  components: {
    ContentFooter,
    AlertDialog,
  },

  data: () => ({
    drawer: true,
    str_title_name_app: Constants.str_title_name_app,
    str_slogan: Constants.str_slogan,
    str_legal_name: "",
    str_company_name: "",
    activa: true,
    value: 0,
    dialogAlert: false,
    mensaje:
      "* Categorice sus movimientos mediante subclasificaciones\n* Asigne un giro y actividad a su cuenta de perfil\n* Ingrese sus saldos iniciales para un mejor balance general (bancos, efectivo, deudas, cobranza, etc)",
    menu: [
      {
        title: Constants.str_registro_diario,
        icon: "mdi-book-open-variant",
        id: 1,
        path: "registro-diario",
      },
      {
        title: Constants.str_edo_resultados,
        icon: "mdi-file-document-multiple",
        id: 2,
        path: "estado-resultados",
      },
      {
        title: Constants.str_balance_general,
        icon: "mdi-format-columns",
        id: 3,
        path: "balance-general",
      },
      {
        title: Constants.str_configuracion,
        icon: "mdi-folder-cog-outline",
        id: 5,
        path: "configuracion",
      },
      {
        title: Constants.str_perfil,
        icon: "mdi-account",
        id: 6,
        path: "perfil",
      },
    ],
    model: 0,
  }),

  created() {
    this.str_legal_name = new Utils().GetValue("legal_name");
    this.str_company_name = new Utils().GetValue("company_name");
    this.activa = /true/i.test(new Utils().GetValue("EmpresaActiva"));
    this.CompanyServices = new CompanyServices();
  },
  mounted() {
    this.percentagecompletion();
  },
  methods: {
    async percentagecompletion() {
      await this.CompanyServices.GetPercentageCompletion(
        new Utils().GetValue("EmpresaTransID")
      ).then((response) => {
        this.mensaje = response.data.message + "\n\n" + this.mensaje;
        this.value = response.data.perce;
      });
    },
    details() {
      this.dialogAlert = true;
    },
    cerrarSesion() {},
  },
};
</script>


<style >
#appBarStyle {
  background-color: black;
}

#spanTitle {
  color: white;
  font-size: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  padding: 10px;
  max-width: 250px;
}

#spanSubtitle {
  color: white;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  display: block;
  width: 450px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#navigationTitle {
  color: black;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
  font-weight: 500;
}

#navigationStyle {
  background-color: lightgrey;
}

#btnLnk {
  /*font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;*/
  font-size: 0.98rem !important;
}
</style>