const generation = require('./generation');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/pdf', express.static('./certificate.pdf'));

app.listen(3000, 'localhost', () => {
    console.log("Server running on port 3000");

    app.get("/", async (req, res) => {
        var { lastname, firstname, birthday, lieunaissance, address, zipcode, town, datesortie, heuresortie, reason } = req.query;
        let profile = {
            lastname: lastname || '',
            firstname: firstname || '',
            birthday: birthday || '',
            lieunaissance: lieunaissance || '',
            address: address || '',
            zipcode: zipcode || '',
            town: town || '',
            datesortie: datesortie || '',
            heuresortie: heuresortie || ''
        };

        if (reason == '' || reason == undefined) {
            reason = 'sport_animaux'
        }



        const pdfBlob = await generation.generatePdf(profile, reason);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=attestation.pdf');
        res.write(Buffer.from(pdfBlob), 'binary');
        res.end();
    });

    app.post("/", async (req, res) => {
        var { lastname, firstname, birthday, lieunaissance, address, zipcode, town, datesortie, heuresortie, reason } = req.body;

        let profile = {
            lastname: lastname || '',
            firstname: firstname || '',
            birthday: birthday || '',
            lieunaissance: lieunaissance || '',
            address: address || '',
            zipcode: zipcode || '',
            town: town || '',
            datesortie: datesortie || '',
            heuresortie: heuresortie || ''
        };
        
        if (reason == '' || reason == undefined) {
            reason = 'sport_animaux'
        }

        const pdfBlob = await generation.generatePdf(profile, reason);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=attestation.pdf');
        res.write(Buffer.from(pdfBlob), 'binary');
        res.end();
    });
});
