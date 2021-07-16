<template>
  <v-row justify="center">
    <!-- mostrar pantalla alerta para mensajes -->
    <AlertDialog
      titulo="Black Administrativo - [ Registro diario ]"
      :mensaje="mensaje"
      :esCancelar="esCancelar"
      :esAceptar="esAceptar"
      :vToolBarColor="vToolBarColor"
      :dialog.sync="dialogAlert"
    />
    <!-- -->

    <Loading :overlay="overlay" />

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title id="titleStyle">
          <span class="headline"
            >{{ title }}
            <span v-if="folio != ''"> | Folio: {{ folio }}</span></span
          >
        </v-card-title>

        <v-container>
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                label="Descripción del movimiento (*)"
                required
                outlined
                v-model="descripcionMovimiento"
                style="padding-left: 1px"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <DatePicker @fechaSeleccionada="fechaSeleccionada" />
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="referencia"
                outlined
                style="padding-left: 1px"
                label="Referencia"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                :value="clasificacionID"
                ref="clasificaciones"
                outlined
                label="Clasificación (*)"
                required
                :items="itemsClasificacion"
                item-text="Clasificacion"
                item-value="ClasificacionID"
                item-key="itemsClasificacion"
                return-object
                @change="clasificacionSeleccionada"
              ></v-select>
            </v-col>
            <v-col cols="8" sm="6">
              <v-select
                outlined
                :value="cuentaID"
                ref="cuentas"
                :items="itemsCuentas"
                item-value="CuentaID"
                item-text="Descripcion"
                item-key="itemsCuentas"
                return-object
                label="Cuenta afectar (*)"
                @change="cuentaSeleccionada"
                style="padding-left: 1px"
              ></v-select>
            </v-col>

            <v-col cols="2" sm="1">
              <div style="padding-left: 3px" class="my-2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="blue"
                      large
                      dark
                      @click.native="limpiar"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Agregar cuenta al catálogo</span>
                </v-tooltip>
              </div>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-textarea
                outlined
                label="Observaciones"
                v-model="observaciones"
              ></v-textarea>
            </v-col>
            <v-col cols="6" sm="6" md="6"></v-col>
            <v-col cols="6" sm="6" md="6">
              <v-text-field
                align="right"
                label="Importe (*)"
                required
                outlined
                type="number"
                v-model="importe"
                @keypress="validarNumero"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn width="25%" color="error" @click.native="cancelar">
            Cancelar
          </v-btn>
          <v-btn
            width="30%"
            color="blue"
            dark
            v-if="accion != 3"
            @click.native="aceptar"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DatePicker from "../components/DatePicker";
import CompanyServices from "../network/services/CompanyService";
//import Utils from "../util/utils";
import Vue from "vue";
import Constants from "../util/constants";
import AlertDialog from "../components/AlertDialog";
import Loading from "../components/Loading";

export default {
  components: {
    DatePicker,
    AlertDialog,
    Loading,
  },
  props: {
    dialog: { type: Boolean, default: false },
    title: { type: String, default: "" },
    accion: { type: Number, default: 0 },
    folio: { type: Number, default: 0 },
    folioID: { type: Number, default: 0 },
    infoRegistro: { type: Array, default: null },
  },
  data: () => ({
    descripcionMovimiento: "",
    referencia: "",
    fechaRegistro: "",
    clasificacionID: 0,
    cuentaID: 0,
    observaciones: "",
    importe: "",
    itemsClasificacion: [],
    itemsCuentas: [],
    esAceptar: false,
    esCancelar: false,
    dialogAlert: false,
    mensaje: "",
    overlay: false,
    vToolBarColor: "green",
  }),
  watch: {
    dialog(visible) {
      if (visible) {
        if (this.accion != 0) this.getInfoRegistry();
      }
    },
  },
  created() {
    this.CompanyServices = new CompanyServices();
  },

  mounted() {
    this.getCatalog();
  },
  methods: {
    getCatalog() {
      this.overlay = true;
      this.getbankaccount("1543832721"); //new Utils().GetValue("empresaTransID"));
      this.getclasifications();
      this.overlay = false;
    },

    async getInfoRegistry() {

      let params = {
        folioID: this.folioID,
      };

      var response = await this.CompanyServices.GetRegistryTransaction(params);
      if (response.data.success !== false) {
        this.referencia = response.data.response[0].Referencia;
        this.clasificacionID = response.data.response[0].ClasificacionID;
        this.cuentaID = response.data.response[0].CuentaID;
        this.descripcionMovimiento = response.data.response[0].Descripcion;
        this.fechaRegistro = response.data.response[0].FechaRegistro;
        this.importe = response.data.response[0].Importe;
        this.observaciones = response.data.response[0].Observaciones;
      } else {
        //this.Utils.SetValue("", "authToken");
        this.messageCreateAccountResponse(
          response.data.message,
          false,
          true,
          "red"
        );
      }
    },

    async getbankaccount(empresaTransID) {
      const rs_itemscuentas = await this.CompanyServices.GetBankaccounts(
        empresaTransID
      );

      if (rs_itemscuentas.status === 200)
        this.itemsCuentas = rs_itemscuentas.data.response;
    },

    async getclasifications() {
      const rs_itemsclasificacion =
        await this.CompanyServices.GetClasifications();

      if (rs_itemsclasificacion.status === 200)
        this.itemsClasificacion = rs_itemsclasificacion.data.response;
    },

    fechaSeleccionada(fecha) {
      this.fechaRegistro = fecha;
    },

    async aceptar() {
      if (
        this.descripcionMovimiento != "" &&
        this.clasificacionID != "" &&
        this.cuentaID != "" &&
        this.importe != ""
      ) {
        if (this.fechaRegistro == "")
          this.fechaRegistro = Vue.filter("formatoFecha")(
            new Date().toISOString().substr(0, 10)
          );

        this.overlay = true;

        let empresaTransID = "1543832721";

        let data = {
          empresaTransID: empresaTransID, //new Utils().GetValue("empresaTransID"),
          descripcion: this.descripcionMovimiento,
          fechaRegistro: this.fechaRegistro,
          referencia: this.referencia,
          clasificacionID: this.clasificacionID,
          cuentaID: this.cuentaID,
          observaciones: this.observaciones,
          importe: this.importe,
          folioID: this.folioID
        };

        let rs_registro = null;
        if(this.accion == 0 )
          rs_registro = await this.CompanyServices.PostRegistryTransaction(data);
        else
          rs_registro = await this.CompanyServices.PostUpdateRegistryTransaction(data);

        if (rs_registro.data.response[0].success) {
          this.overlay = false;
          this.descripcionMovimiento = "";
          this.fechaRegistro = "";
          this.referencia = "";
          this.observaciones = "";
          this.importe = "";
          this.$refs["clasificaciones"].reset();
          this.$refs["cuentas"].reset();
          this.$emit("update:dialog", false);
          this.$emit("getregistries");
          this.overlay = false;
        }
      } else {
        this.mensaje = Constants.str_error_registry;
        this.esCancelar = false;
        this.esAceptar = true;
        this.vToolBarColor = "red";

        this.dialogAlert = true;
      }
    },
    cancelar() {
      this.$refs["clasificaciones"].reset();
      this.$refs["cuentas"].reset();
      this.importe = "";
      this.descripcionMovimiento = "";
      this.referencia = "";
      this.observaciones = "";
      this.clasificacionID = 0;
      this.cuentaID = 0;
      this.$emit("update:dialog", false);
    },
    clasificacionSeleccionada(value) {
      this.clasificacionID = value.ClasificacionID;
    },
    cuentaSeleccionada(value) {
      this.cuentaID = value.CuentaID;
    },
    limpiar() {},
    validarNumero(e) {
      if (e.keyCode < 48 || e.keyCode > 57) {
        if (e.keyCode != 46) e.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
#titleStyle {
  background-color: black;
  color: white;
}
</style>