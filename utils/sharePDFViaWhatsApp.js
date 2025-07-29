import Share from 'react-native-share';

const sharePDFViaWhatsApp = async (pdfPath) => {
  try {
    await Share.open({
      url: `file://${pdfPath}`,
      type: 'application/pdf',
      social: Share.Social.WHATSAPP,
    });
  } catch (error) {
    console.error('Error sharing PDF:', error);
  }
};

const exportAndSend = async (data) => {
  try {
    const pdfPath = await generatePDF(data);
    await sharePDFViaWhatsApp(pdfPath);
  } catch (err) {
    console.error('Error exporting and sending PDF:', err);
  }
};
