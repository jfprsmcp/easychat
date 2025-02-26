<script>
export default {
  name: 'EasyContactPolicies',
  methods: {
    goBack() {
      window.history.back();
    }
  }
};
</script>
<template>
  <div class="privacy-policy-container">
    <div class="policy-content">
      <h1 class="title">POLÍTICA DE PRIVACIDAD</h1>
      <p class="intro-text">
        El presente Política de Privacidad establece los términos en que Easy Contact usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios.
        Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo, esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.
      </p>

      <section class="section">
        <h2 class="subheading">Información que es recogida</h2>
        <p>
          Nuestro sitio web podrá recoger información personal por ejemplo: Nombre, información de contacto como su dirección de correo electrónico e información demográfica. Así mismo, cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.
        </p>
      </section>

      <section class="section">
        <h2 class="subheading">Uso de la información recogida</h2>
        <p>
          Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.
        </p>
        <p>
          Easy Contact está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.
        </p>
      </section>

      <section class="section">
        <h2 class="subheading">Cookies</h2>
        <p>
          Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador. Al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente.
        </p>
        <p>
          Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo, las cookies ayudan a proporcionar un mejor servicio de los sitios web, estas no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente.
        </p>
      </section>

      <section class="section">
        <h2 class="subheading">Enlaces a Terceros</h2>
        <p>
          Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted de clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre el sitio al que es redirigido y por lo tanto no somos responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios terceros.
        </p>
      </section>

      <section class="section">
        <h2 class="subheading">Control de su información personal</h2>
        <p>
          En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web. Cada vez que se le solicite rellenar un formulario, como el de alta de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico. En caso de que haya marcado la opción de recibir nuestro boletín o publicidad usted puede cancelarla en cualquier momento.
        </p>
        <p>
          Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con un orden judicial.
        </p>
      </section>

      <section class="section">
        <h2 class="subheading">Tus derechos</h2>
        <p>
          El Titular te informa que sobre tus datos personales tienes derecho a:
        </p>
        <ul>
          <li>Solicitar el acceso a los datos almacenados.</li>
          <li>Solicitar una rectificación o la cancelación.</li>
          <li>Solicitar la limitación de su tratamiento.</li>
          <li>Oponerte al tratamiento.</li>
          <li>Solicitar la portabilidad de tus datos.</li>
        </ul>
      </section>

      <section class="section">
        <h2 class="subheading">Principios aplicados en el tratamiento de datos</h2>
        <p>
          En el tratamiento de tus datos personales, el Titular aplicará los siguientes principios:
        </p>
        <ul>
          <li>Principio de licitud, lealtad y transparencia.</li>
          <li>Principio de minimización de datos.</li>
          <li>Principio de limitación del plazo de conservación.</li>
          <li>Principio de integridad y confidencialidad.</li>
        </ul>
      </section>

      <section class="section">
        <h2 class="subheading">Eliminación de datos</h2>
        <p>
          Si un usuario desea eliminar permanentemente su cuenta y los datos asociados, puede realizar la solicitud de eliminación a través de <a href="mailto:servicios@easycontact.com">servicios@easycontact.com</a>.
        </p>
      </section>
      <div class="back-button-container">
        <button @click="goBack" class="back-button">Volver</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.privacy-policy-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
}

.policy-content {
  max-width: 800px;
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.intro-text {
  text-align: justify;
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 20px;
}

.subheading {
  font-size: 1.4rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 10px;
}

ul {
  padding-left: 20px;
}

ul li {
  font-size: 1.1rem;
  line-height: 1.6;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.back-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>
