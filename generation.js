const { PDFDocument, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const fetch = require('node-fetch');
const { library } = require('@fortawesome/fontawesome-svg-core');
const { faEye, faFilePdf } = require('@fortawesome/free-solid-svg-icons');

library.add(faEye, faFilePdf);

let year = 0, month = 0, day = 0;

const ys = {
    travail: 578,
    achats: 533,
    sante: 477,
    famille: 435,
    handicap: 396,
    sport_animaux: 358,
    convocation: 295,
    missions: 255,
    enfants: 211,
  }

const generateQR = async text => {
    try {
        var opts = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
        };
        return await QRCode.toDataURL(text, opts)
    } catch (err) {
        console.error(err)
    }
};

const setDateNow = (date) => {
    year = date.getFullYear()
    month = pad(date.getMonth() + 1); // Les mois commencent à 0
    day = pad(date.getDate())
};

const idealFontSize = (font, text, maxWidth, minSize, defaultSize) => {
    let currentSize = defaultSize
    let textWidth = font.widthOfTextAtSize(text, defaultSize)
  
    while (textWidth > maxWidth && currentSize > minSize) {
      textWidth = font.widthOfTextAtSize(text, --currentSize)
    }
  
    return (textWidth > maxWidth) ? null : currentSize
};
  

const generatePdf = async (profile, reasons = '') => {
    const generatedDate = new Date();
    setDateNow(generatedDate);
    const creationDate = `${day}/${month}/${year}`;

    const hour = pad(generatedDate.getHours());
    const minute = pad(generatedDate.getMinutes());
    const creationHour = `${hour}h${minute}`;

    const { lastname, firstname, birthday, lieunaissance, address, zipcode, town, datesortie, heuresortie } = profile;
    const releaseHours = String(heuresortie).substring(0, 2);
    const releaseMinutes = String(heuresortie).substring(3, 5);

    const data = [
        `Cree le: ${creationDate} a ${creationHour}`,
        `Nom: ${lastname}`,
        `Prenom: ${firstname}`,
        `Naissance: ${birthday} a ${lieunaissance}`,
        `Adresse: ${address} ${zipcode} ${town}`,
        `Sortie: ${datesortie || day + '/' + month + '/' + year} a ${releaseHours || hour}h${releaseMinutes || minute}`,
        `Motifs: ${reasons}`,
    ].join('; ');

    const existingPdfBytes = await fetch("http://localhost:3000/pdf").then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page1 = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const drawText = (text, x, y, size = 11) => {
        page1.drawText(text, { x, y, size, font })
    }

//    drawText(`${firstname} ${lastname}`, 123, 686);
//    drawText(birthday, 123, 661);
//    drawText(lieunaissance, 92, 638);
//    drawText(`${address} ${zipcode} ${town}`, 134, 613);

    drawText(`${firstname} ${lastname}`, 119, 696);
    drawText(birthday, 119, 674);
    drawText(lieunaissance, 297, 674);
    drawText(`${address} ${zipcode} ${town}`, 133, 652);

    reasons.split(',').forEach(reason => {
        if(ys[reason] != undefined)
        {
            drawText('x', 78, ys[reason], 18)
        }
    });

    //if (ys[reasons] != undefined)
    //  drawText('x', 78, ys[reason], 18)

    let locationSize = idealFontSize(font, profile.town, 83, 7, 11);

    if (!locationSize) {
        alert('Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
            'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.');
        locationSize = 7
    }

    drawText(profile.town, 105, 175, locationSize);


        // Date sortie
        drawText(`${datesortie || day + '/' + month + '/' + year}`, 91, 152,11);
        drawText(releaseHours || hour, 255, 152,11);
        drawText(':', 270, 152,11);        
        drawText(releaseMinutes || minute, 275, 152,11);

    // Date création
    //drawText('Date de création:', 464, 110, 7);
    //drawText(`${creationDate} à ${creationHour}`, 455, 104, 7);

    const generatedQR = await generateQR(data);

    const qrImage = await pdfDoc.embedPng(generatedQR);

    page1.drawImage(qrImage, {
        x: page1.getWidth() - 156,
        y: 100,
        width: 92,
        height: 92,
    });

    pdfDoc.addPage();
    const page2 = pdfDoc.getPages()[1];
    page2.drawImage(qrImage, {
        x: 50,
        y: page2.getHeight() - 350,
        width: 300,
        height: 300,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};

const pad = (str) => {
    return String(str).padStart(2, '0')
};

exports.generatePdf = generatePdf;