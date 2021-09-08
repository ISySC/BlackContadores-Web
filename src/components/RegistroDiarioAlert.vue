<template>
  <v-row justify="center">
    <SubclasificacionAlert
      :dialog.sync="dialogsub"
      title="Agregar nueva subclasificación"
      :itemsClasificacion="itemsClasificacion"
      @getSubclasificaciones="getsubclasifications"
    />
    <CuentaAlert
      :dialog.sync="dialogaccount"
      title="Agregar nueva cuenta"
      @getCuentas="getbankaccount"
    />
    <CuentaPorAlert
      :dialog.sync="dialogaccountto"
      :abono.sync="importe"
      :cxCID.sync="CxCID"
      :cuentaPagoID.sync="CuentaPagoID"
      :total.sync="Total"
      :subclasificacionID.sync="subclasificacionID"
      :title="'Selecciona cuenta por ' + (TipoCuenta == 3 ? 'cobrar' : 'pagar')"
      :tipoCuenta="TipoCuenta"
      :itemsSubClasificacion="itemsSubClasificacion"
      :itemsCuentas="cuentas"
    />
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
            <v-col cols="12" sm="12">
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
            <v-col cols="12" sm="10" v-if="clasificacionID !== 4">
              <v-select
                :value="subclasificacionID"
                ref="subclasificaciones"
                outlined
                label="Subclasificación (*)"
                required
                :items="itemsSubClasificacion"
                item-text="Concepto"
                item-value="ConceptoID"
                item-key="itemsSubClasificacion"
                return-object
                @change="subclasificacionSeleccionada"
              ></v-select>
            </v-col>
            <v-col
              v-if="clasificacionID !== 4"
              cols="12"
              sm="2"
              class="py-2 pl-2"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    block
                    v-bind="attrs"
                    v-on="on"
                    color="blue"
                    large
                    dark
                    @click.native="mostrarRegistroSubAlert"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Agregar subclasificacion al catálogo</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="10">
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
            <v-col cols="12" sm="2" class="py-2 pl-2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    block
                    v-bind="attrs"
                    v-on="on"
                    color="blue"
                    large
                    dark
                    @click.native="mostrarRegistroCuentaAlert"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Agregar cuenta al catálogo</span>
              </v-tooltip>
            </v-col>
            <v-col v-if="clasificacionID == 4" cols="12" sm="12">
              <div style="padding-left: 3px" class="my-2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      block
                      v-bind="attrs"
                      v-on="on"
                      color="success"
                      large
                      dark
                      @click.native="mostrarRegistroCuentaToAlert"
                    >
                      Ver Cuentas afectables
                    </v-btn>
                  </template>
                  <span>Ver Cuentas</span>
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
                :min="0"
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
import Utils from "../util/utils";
import Constants from "../util/constants";
import AlertDialog from "../components/AlertDialog";
import Loading from "../components/Loading";
import CuentaAlert from "../components/CuentaAlert";
import CuentaPorAlert from "../components/CuentasPorAlert";
import SubclasificacionAlert from "../components/SubclasificacionAlert";

export default {
  components: {
    DatePicker,
    AlertDialog,
    Loading,
    CuentaAlert,
    CuentaPorAlert,
    SubclasificacionAlert,
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
    CuentaPagoID: 0,
    descripcionMovimiento: "",
    referencia: "",
    fechaRegistro: "",
    clasificacionID: 0,
    subclasificacionID: 0,
    cuentaID: 0,
    observaciones: "",
    importe: "",
    itemsClasificacion: [],
    itemsSubClasificacion: [],
    itemsCuentas: [],
    cuentas: [],
    esAceptar: false,
    esCancelar: false,
    dialogAlert: false,
    mensaje: "",
    overlay: false,
    vToolBarColor: "green",
    dialogaccount: false,
    dialogaccountto: false,
    dialogsub: false,
    SubClasificaciones: [],
    TipoCuenta: 0,
    Abono: 0,
    CxCID: 0,
    Total: 0,
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
    this.Utils = new Utils();
    this.getCatalog();
  },

  mounted() {},
  methods: {
    getCatalog() {
      this.overlay = true;
      this.getbankaccount();
      this.getclasifications();
      this.getsubclasifications();
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
        this.messageCreateAccountResponse(
          response.data.message,
          false,
          true,
          "red"
        );
      }
    },

    async getbankaccount() {
      let data = {
        empresaTransID: this.Utils.GetValue("EmpresaTransID"),
        mostrarInactivos: 0,
      };

      const rs_itemscuentas = await this.CompanyServices.GetBankaccounts(data);

      if (rs_itemscuentas.status === 200) {
        this.cuentas = rs_itemscuentas.data.response;
        this.itemsCuentas = rs_itemscuentas.data.response;
      }
    },
    async getsubclasifications() {
      let data = {
        EmpresaTransID: this.Utils.GetValue("EmpresaTransID"),
        mostrarInactivos: 0,
      };
      const response = await this.CompanyServices.GetSubclasifications(data);

      if (response.status === 200)
        this.SubClasificaciones = response.data.response;
      //this.itemsSubClasificacion = response.data.response;
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
    currentDate() {
      const current = new Date();
      const date = `${
        current.getDate() < 10 ? "0" + current.getDate() : current.getDate()
      }/${
        current.getMonth() + 1 < 10
          ? "0" + (current.getMonth() + 1)
          : current.getMonth() + 1
      }/${current.getFullYear()}`;
      return date;
    },
    async guardarRegistro() {
      let rs_registro = null;
      if (this.fechaRegistro == "") this.fechaRegistro = this.currentDate();
      this.overlay = true;

      let empresaTransID = this.Utils.GetValue("EmpresaTransID");

      let data = {
        empresaTransID: empresaTransID, //new Utils().GetValue("empresaTransID"),
        descripcion: this.descripcionMovimiento,
        fechaRegistro: this.currentDate(),
        referencia: this.referencia,
        clasificacionID: this.clasificacionID,
        cuentaID: this.cuentaID,
        observaciones: this.observaciones,
        importe: this.importe,
        folioID: this.folioID,
        subclasificacionID: this.subclasificacionID,
        tipoPagoCuenta: this.CuentaPagoID,
        CreadoPor: new Utils().GetValue("correoUsuario"),
        EsCxC: this.TipoCuenta == 3 ? true : false,
      };

      rs_registro = null;
      if (this.accion == 0)
        rs_registro = await this.CompanyServices.PostRegistryTransaction(data);
      else
        rs_registro = await this.CompanyServices.PostUpdateRegistryTransaction(
          data
        );

      if (rs_registro.data.response[0].success) {
        this.overlay = false;
        this.descripcionMovimiento = "";
        this.fechaRegistro = "";
        this.referencia = "";
        this.observaciones = "";
        this.importe = "";
        this.$refs["clasificaciones"].reset();
        this.$refs["subclasificaciones"].reset();
        this.$refs["cuentas"].reset();
        this.$emit("update:dialog", false);
        this.$emit("getregistries");
        this.overlay = false;
      }
    },
    async guardarAbono() {
      let rs_registro = null;
      if (this.CxCID == 0) {
        this.mensaje =
          "Para guardar un pago es necesario seleccionar una cuenta y registrar un abono mayor a 0 y menor al saldo restante.";
        this.esCancelar = false;
        this.esAceptar = true;
        this.vToolBarColor = "red";

        this.dialogAlert = true;
        return false;
      }
      let data = {
        EsCxC: this.CxCID,
        Abono: this.importe,
        CreadoPor: new Utils().GetValue("correoUsuario"),
        Total: this.Total,
        TipoPagoCuentaID: this.CuentaPagoID,
      };

      rs_registro = await this.CompanyServices.PostCollection(data);
      if (rs_registro.data.response[0].success) this.guardarRegistro();
    },
    async aceptar() {
      if (
        this.descripcionMovimiento != "" &&
        this.clasificacionID != "" &&
        this.cuentaID != "" &&
        this.importe != ""
      ) {
        if (this.clasificacionID == 4) {
          this.guardarAbono();
          this.guardarRegistro();
        } else this.guardarRegistro();
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
      this.sizecol = 6;
      this.$emit("update:dialog", false);
    },
    subclasificacionSeleccionada(value) {
      this.subclasificacionID = value.ConceptoID;
    },

    clasificacionSeleccionada(value) {
      this.clasificacionID = value.ClasificacionID;
      this.itemsSubClasificacion = this.SubClasificaciones.filter(
        (Subclasificacion) =>
          Subclasificacion.ClasificacionID == value.ClasificacionID
      );
      if (this.clasificacionID == 4)
        this.itemsCuentas = this.cuentas.filter(
          (cuenta) => cuenta.TipoCuentaID == 3 || cuenta.TipoCuentaID == 4
        );
      else this.itemsCuentas = this.cuentas;
    },
    cuentaSeleccionada(value) {
      this.cuentaID = value.CuentaID;
      this.TipoCuenta = this.cuentas.filter(
        (cuenta) => cuenta.CuentaID === value.CuentaID
      )[0]["TipoCuentaID"];
    },
    mostrarRegistroSubAlert() {
      this.dialogsub = true;
    },
    mostrarRegistroCuentaAlert() {
      this.dialogaccount = true;
    },
    mostrarRegistroCuentaToAlert() {
      this.dialogaccountto = true;
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