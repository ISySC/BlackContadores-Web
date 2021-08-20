<template id="ca">
  <v-main class="px-4" style="padding: 0px; padding-top: 84px; height: 100%">
    <RegistroDiarioAlert
      :dialog.sync="dialog"
      :title="titulo"
      :accion="accion"
      :folioID="folioID"
      :folio="folio"
      @getregistries="getregistries"
    />

    <Loading :overlay="overlay" />

    <!-- mostrar pantalla alerta para mensajes -->
    <AlertDialog
      titulo="Black Administrativo - [ Problemas con el servicio ]"
      :mensaje="mensaje"
      :esCancelar="esCancelar"
      :esAceptar="esAceptar"
      :vToolBarColor="vToolBarColor"
      :dialog.sync="dialogAlert"
    />

    <v-dialog v-model="eliminar" persistent max-width="490">
      <v-card>
        <v-card-title class="text-h5">
          ¿Eliminar el registro seleccionado con el numero de folio
          {{ folio }} ?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="eliminar = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="DeleteRegistry">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <base-material-card color="blue pa-0" style="height: 100%">
      <template v-slot:heading>
        <p class="text-left text-h5">
          REGISTRO DIARIO |
          <span class="text-subtitle-1" id="textDescription"
            >Registra tus movimientos diarios, como ingresos, gastos y
            compras.</span
          >
        </p>
      </template>
      <v-card-text style="height: 92%">
        <v-simple-table style="height: 100%" class="grey lighten-3">
          <template v-slot:default>
            <thead>
              <tr id="headerTitle">
                <th
                  class="
                    text-center text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                >
                  FOLIO
                </th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                >
                  DESCRIPCION
                </th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                >
                  FECHA
                </th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                >
                  REFERENCA
                </th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                >
                  CLASIFICACION
                </th>
                <th
                  class="
                    text-center text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                >
                  IMPORTE
                </th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                >
                  CUENTA
                </th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                ></th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                ></th>
                <th
                  class="
                    text-left text-truncate
                    font-weight-regular
                    black
                    white--text
                  "
                ></th>
              </tr>
            </thead>
            <tbody v-if="items.length > 0">
              <tr v-for="item in items" :key="item.FolioID">
                <td style="width: 30px; text-align: center">
                  {{ item.Folio }}
                </td>
                <td style="width: 300px">{{ item.DescripcionMovimiento }}</td>
                <td style="width: 30px; text-align: left">
                  {{ item.FechaRegistro }}
                </td>
                <td style="width: 150px">{{ item.Referencia }}</td>
                <td style="width: 100px">{{ item.Clasificacion }}</td>
                <td style="width: 120px; text-align: right">
                  <v-chip
                    :color="getColorClasification(item.ClasificacionID)"
                    dark
                    >{{ item.Importe | formatoMoneda }}</v-chip
                  >
                </td>
                <td style="width: 200px">{{ item.Descripcion }}</td>
                <td style="width: 40px">
                  <v-icon
                    @click="
                      mostrarRegistroAlert(
                        2,
                        'Editar movimiento',
                        item.FolioID,
                        item.Folio
                      )
                    "
                  >
                    mdi-pencil
                  </v-icon>
                </td>
                <td style="width: 40px">
                  <v-icon
                    @click="
                      mostrarRegistroAlert(
                        3,
                        'Consultar movimiento',
                        item.FolioID,
                        item.Folio
                      )
                    "
                  >
                    mdi-file-search
                  </v-icon>
                </td>
                <td style="width: 40px">
                  <v-icon @click="onDelete(item.FolioID, item.Folio)">
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </tbody>
            <tr style="height: 200px" v-else>
              <td colspan="9" style="text-align: center; font-size: 20px">
                {{ str_no_data }}
              </td>
            </tr>
            <v-btn
              @click="mostrarRegistroAlert(0, 'Agregar nuevo movimiento', 0, 0)"
              color="blue"
              dark
              absolute
              bottom
              right
              fab
              style="margin-bottom: 90px; margin-right: 40px"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-simple-table>
        <h2 class="pt-3 pl-4">Total movimientos : {{ items.length }}</h2>
      </v-card-text>
    </base-material-card>
  </v-main>
</template>

<script>
import RegistroDiarioAlert from "../components/RegistroDiarioAlert";
import CompanyServices from "../network/services/CompanyService";
import Utils from "../util/utils";
import Vue from "vue";
import Constants from "../util/constants";
import Loading from "../components/Loading";
import AlertDialog from "../components/AlertDialog";

export default {
  components: {
    RegistroDiarioAlert,
    Loading,
    AlertDialog,
  },
  data: () => ({
    eliminar: false,
    value: null,
    items: [],
    dialog: false,
    dialogAlert: false,
    esCancelar: false,
    titulo: "",
    accion: 0,
    esAceptar: false,
    folio: 0,
    mensaje: "",
    folioID: 0,
    overlay: false,
    vToolBarColor: "",
    str_no_data: Constants.str_no_data,
  }),

  created() {
    this.CompanyServices = new CompanyServices();
    this.Utils = new Utils();
    this.getRegistriesOfDay();
  },
  methods: {
    async DeleteRegistry() {
      this.overlay = true;

      let params = {
        folioID: this.folioID,
      };

      const rs_registriesitems =
        await this.CompanyServices.PostDeleteRegistryTransaction(params);

      if (rs_registriesitems.status === 0 || rs_registriesitems.status === 500)
        this.messageCreateAccountResponse(
          rs_registriesitems.message,
          false,
          true,
          "red"
        );
      else if (rs_registriesitems.data.success) {
        this.getRegistriesOfDay();
      }
      this.getRegistriesOfDay();
      this.overlay = false;
      this.eliminar = false;
    },
    onDelete(folioID, folio) {
      this.folioID = folioID;
      this.folio = folio;
      this.eliminar = true;
    },
    getColorClasification(clasificacionID) {
      if (clasificacionID == 2) return "red";
      else if (clasificacionID == 1) return "green";
      else return "orange";
    },
    mostrarRegistroAlert(accion, titulo, folioID, folio) {
      this.titulo = titulo;
      this.accion = accion;
      this.folioID = folioID;
      this.folio = folio;
      this.dialog = true;
    },
    async getRegistriesOfDay() {
      this.overlay = true;

      let params = {
        EmpresaTransID: this.Utils.GetValue("EmpresaTransID"), //new Utils().GetValue("empresaTransID"),
        FechaRegistro: Vue.filter("formatoFecha")(
          new Date().toISOString().substr(0, 10)
        ),
      };

      const rs_registriesitems =
        await this.CompanyServices.GetRegistriesTransaction(params);

      if (rs_registriesitems.status === 0 || rs_registriesitems.status === 500)
        this.messageCreateAccountResponse(
          rs_registriesitems.message,
          false,
          true,
          "red"
        );
      else if (rs_registriesitems.data.success) {
        this.items = rs_registriesitems.data.response;
      }

      this.overlay = false;
    },
    getregistries() {
      this.getRegistriesOfDay();
    },

    messageCreateAccountResponse(message, esCancelar, esAceptar, color) {
      this.mensaje = message;
      this.esCancelar = esCancelar;
      this.esAceptar = esAceptar;
      this.vToolBarColor = color;
      this.dialogAlert = true;

      this.overlay = false;
    },
  },
};
</script>


<style scope>
#sheetStyle {
  color: white;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 24px;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 1px;
}
#textDescription {
  color: white;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 18px;
}
.headerTitle {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 50px;
}
</style>