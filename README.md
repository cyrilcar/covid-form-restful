# Générateur de certificat de déplacement RESTful Q4 2020


### Installer le projet

```console
$ git clone https://github.com/adrienafl/covid-form-restful.git
$ cd covid-form-restful
$ npm install
$ node covidform.js
```

### Paramètres à passer (string) en POST OU GET

- lastname, 
- firstname
- birthday
- lieunaissance
- address
- zipcode
- town
- datesortie (optional)
- heuresortie (optional)
- reason {travail,achats,sante,famille,handicap,sport_animaux,convocation,missions,enfants}

URL d'exemple pour un GET : http://localhost:xxxx/?lastname=Emmanuel&firstname=Macron&birthday=01/01/2020&lieunaissance=Paris&address=29%20Rue%20De%20Paris&zipcode=75009&town=Lyon&reason=achats

PS : Don't be evil with this project

## Crédits

Ce projet a été réalisé à partir d'un fork du dépôt [deplacement-covid-19](https://github.com/LAB-MI/deplacement-covid-19)

Il adapte la récente mise à jour Q4 2020 : [attestation-deplacement-derogatoire-q4-2020](https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020)

Co-réalisation par :
- Eric Petris <https://github.com/ericpetris>
- Adrien Afl

Les projets open source suivants ont été utilisés pour le développement de ce 
service :

- [PDF-LIB](https://pdf-lib.js.org/)
- [qrcode](https://github.com/soldair/node-qrcode)
- [Font Awesome](https://fontawesome.com/license)

