import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateAndSharePDF = async (data) => {
  // Parse extra_services string into a list of selected services with quantity
  const parseExtraServicesTable = (str) => {
    try {
      const entries = str
        .replace(/{|}/g, '')
        .split(', ')
        .map(pair => pair.split('='))
        .filter(([key, value]) => value !== 'false' && Number(value) > 0)
        .map(([key, value]) => ({
          name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          quantity: value,
        }));

      if (!entries.length) return '<p>Ninguno</p>';

      const rows = entries.map(service => `
        <tr>
          <td>${service.name}</td>
          <td style="text-align: center;">${Number(service.quantity) % 1 === 0 ? parseInt(service.quantity) : service.quantity}</td>
        </tr>
      `).join('');

      return `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px; background: #f2f2f2;">Servicio</th>
              <th style="border: 1px solid #ccc; padding: 8px; background: #f2f2f2;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    } catch {
      return '<p>Error al procesar servicios.</p>';
    }
  };

  const formatDate = (iso) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #007bff;
            border-bottom: 2px solid #007bff;
            padding-bottom: 5px;
          }
          .section {
            margin-bottom: 20px;
          }
          .label {
            font-weight: bold;
          }
          .value {
            margin-left: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Detalle del Evento</h1>

        <div class="section">
          <div><span class="label">Evento:</span><span class="value">${data.evento || 'N/A'}</span></div>
          <div><span class="label">Cliente:</span><span class="value">${data.cliente || 'N/A'}</span></div>
          <div><span class="label">Fecha:</span><span class="value">${formatDate(data.fecha)}</span></div>
          <div><span class="label">Cantidad de personas:</span><span class="value">${data.cantidad_personas || 'N/A'}</span></div>
          <div><span class="label">Descripción:</span><span class="value">${data.descripcion || 'N/A'}</span></div>
        </div>

        <div class="section">
          <div><span class="label">Servicios adicionales:</span></div>
          ${parseExtraServicesTable(data.extra_services)}
        </div>

        <div class="section">
          <div><span class="label">Total:</span><span class="value">Gs. ${data.monto_total || 'N/A'}</span></div>
          <div><span class="label">Pagado:</span><span class="value">Gs. ${data.pagado || 'N/A'}</span></div>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log('PDF generado:', uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Enviar PDF',
        UTI: 'com.adobe.pdf',
      });
    } else {
      alert('Compartir no está disponible en este dispositivo.');
    }
  } catch (err) {
    console.error('PDF sharing error:', err);
    alert('Error generando el PDF.');
  }
};
