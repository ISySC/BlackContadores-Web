<template id="ca">
  <v-main class="px-4" style="padding: 0px; padding-top: 60px; height: 100%">
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
    <!-- -->

    <base-material-card color="blue pa-0" style="height: 97%">
      <template v-slot:heading>
        <div class="text-left text-h5 d-flex">
          ESTADO DE RESULTADOS |
          <span class="text-subtitle-1" id="textDescription"
            >Consulta los resultados de tus estados.</span
          >
          <div
            class="d-flex justify-end"
            style="margin-left: 40px; width: 200px"
          >
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  filled
                  v-model="dateFormatted"
                  label="Fecha Inicio"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @blur="date = parseDate(dateFormatted)"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="FechaInicio"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </div>
          <div
            class="d-flex justify-end"
            style="margin-left: 40px; width: 200px"
          >
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  filled
                  v-model="dateFormatted2"
                  label="Fecha Fin"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @blur="date = parseDate(dateFormatted2)"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="FechaFin"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </div>
          <div
            class="d-flex justify-end"
            style="margin-left: 40px; width: 400px"
          >
            <v-select
              :value="clasificacionID"
              ref="clasificaciones"
              filled
              label="Clasificación (*)"
              required
              :items="itemsClasificacion"
              item-text="Clasificacion"
              item-value="ClasificacionID"
              item-key="itemsClasificacion"
              return-object
              @change="clasificacionSeleccionada"
            ></v-select>
            <v-btn
              class="ma-1 ml-7"
              color="indigo"
              x-large
              @click="getRegistriesOfDay"
            >
              Filtrar
            </v-btn>
          </div>
        </div>
      </template>
      <v-card-text style="height: 92%">
        <v-container class="p-0" style="height: 100%">
          <v-row no-gutters style="height: 100%">
            <v-col cols="12" sm="10" class="pr-7" style="height: 100%">
              <v-simple-table class="grey lighten-3" style="height: 100%">
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
                    </tr>
                  </thead>
                  <tbody v-if="items.length > 0">
                    <tr v-for="item in items" :key="item.FolioID">
                      <td style="width: 30px; text-align: center">
                        {{ item.Folio }}
                      </td>
                      <td style="width: 300px">
                        {{ item.DescripcionMovimiento }}
                      </td>
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
                    </tr>
                  </tbody>
                  <tr style="height: 200px" v-else>
                    <td colspan="9" style="text-align: center; font-size: 20px">
                      {{
                        "Sin registro de movimientos en las fechas seleccionadas"
                      }}
                    </td>
                  </tr>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="12" sm="2">
              <h3>Totales</h3>
              <br />
              <v-text-field
                readonly
                :label="clasificacionID == 0 ? 'Total Ingresos' : 'Total'"
                :value="totalIngresos | formatoMoneda"
                filled
              ></v-text-field>
              <v-text-field
                readonly
                label="Total Gastos"
                :value="totalGastos | formatoMoneda"
                filled
                v-if="clasificacionID == 0"
              ></v-text-field>
              <v-text-field
                readonly
                label="Total Compras"
                :value="totalCompras | formatoMoneda"
                filled
                v-if="clasificacionID == 0"
              ></v-text-field>
              <v-divider />
              <br />
              <h3 v-if="clasificacionID == 0">Utilidades</h3>
              <br />
              <v-text-field
                readonly
                label="Utilidad Costos"
                :value="utilidadCostos | formatoPorcentaje"
                filled
                v-if="clasificacionID == 0"
              ></v-text-field>
              <v-text-field
                readonly
                label="Utilidad Gastos"
                :value="utilidadGastos | formatoPorcentaje"
                filled
                v-if="clasificacionID == 0"
              ></v-text-field>
              <v-text-field
                readonly
                label="Utilidad Neta"
                :value="utilidadNeta | formatoMoneda"
                filled
                v-if="clasificacionID == 0"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </base-material-card>
  </v-main>
</template>

<script>
import CompanyServices from "../network/services/CompanyService";
import Constants from "../util/constants";
import Loading from "../components/Loading";
import AlertDialog from "../components/AlertDialog";
import Vue from "vue";
import Utils from "../util/utils";

export default {
  components: {
    Loading,
    AlertDialog,
  },
  data: (vm) => ({
    FechaInicio: new Date().toISOString().substr(0, 10),
    FechaFin: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    dateFormatted2: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu2: false,
    menu: false,
    totalIngresos: 0,
    totalGastos: 0,
    totalCompras: 0,
    utilidadCostos: 0,
    utilidadGastos: 0,
    utilidadNeta: 0,
    clasificacionID: 0,
    mensaje: "",
    items: [],
    dialog: false,
    dialogAlert: false,
    esCancelar: false,
    esAceptar: false,
    overlay: false,
    vToolBarColor: "",
    itemsClasificacion: [],
    str_no_data: Constants.str_no_data,
  }),

  created() {
    this.CompanyServices = new CompanyServices();
    this.Utils = new Utils();
    this.getRegistriesOfDay();
    this.getclasifications();
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  watch: {
    FechaInicio() {
      var datefin = new Date(this.FechaFin);
      var date = new Date(this.FechaInicio);
      var newDate = new Date(datefin.setMonth(date.getMonth()));
      this.FechaFin = new Date(newDate).toISOString().substr(0, 10);
      this.dateFormatted = this.formatDate(this.FechaInicio);
      this.dateFormatted2 = this.formatDate(this.FechaFin);
    },
    FechaFin() {
      this.dateFormatted = this.formatDate(this.FechaInicio);
      this.dateFormatted2 = this.formatDate(this.FechaFin);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    onChangeFechaInicio(value) {
      console.log(value);
    },
    clasificacionSeleccionada(value) {
      this.clasificacionID = value.ClasificacionID;
    },
    async getclasifications() {
      const rs_itemsclasificacion =
        await this.CompanyServices.GetClasifications();

      if (rs_itemsclasificacion.status === 200) {
        this.itemsClasificacion = rs_itemsclasificacion.data.response;
        this.itemsClasificacion.push({ ClasificacionID: "0", Clasificacion: "Todas" });
      }
    },
    fechaSeleccionada(fecha) {
      this.FechaInicio = fecha;
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

      let empresaTransID = this.Utils.GetValue("EmpresaTransID");

      let params = {
        ClasificacionID: this.clasificacionID ? this.clasificacionID : 0,
        empresaTransID: empresaTransID, //new Utils().GetValue("empresaTransID"),
        FechaInicio: Vue.filter("formatoFecha")(
          new Date(this.FechaInicio).toISOString().substr(0, 10)
        ),
        FechaFin: Vue.filter("formatoFecha")(
          new Date(this.FechaFin).toISOString().substr(0, 10)
        ),
      };

      const rs_registriesitems =
        await this.CompanyServices.GetRegistriesTransactionResults(params);

      if (rs_registriesitems.status === 0 || rs_registriesitems.status === 500)
        this.messageCreateAccountResponse(
          rs_registriesitems.message,
          false,
          true,
          "red"
        );
      else if (rs_registriesitems.data.success) {
        this.items = rs_registriesitems.data.response;
        if (rs_registriesitems.data.totalAccount.TotalIngreso) {
          this.totalIngresos =
            rs_registriesitems.data.totalAccount.TotalIngreso;
          this.totalGastos = rs_registriesitems.data.totalAccount.TotalGasto;
          this.totalCompras = rs_registriesitems.data.totalAccount.TotalCompra;
          this.utilidadCostos =
            rs_registriesitems.data.totalAccount.MargenUtilidadCosto;
          this.utilidadGastos =
            rs_registriesitems.data.totalAccount.MargenUtilidadGasto;
          this.utilidadNeta = rs_registriesitems.data.totalAccount.UtilidadNeta;
        } else
          this.totalIngresos =
            rs_registriesitems.data.totalAccount.TotalMovimiento;
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