"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var XLSX = require('xlsx');

var pdfMakePrinter = require('pdfmake/src/printer');

var JsBarcode = require('jsbarcode');

var _require = require("canvas"),
    Canvas = _require.Canvas;

var path = require('path');
/* GET home page. */


router.get('/', function (req, res, next) {
  res.render('home', {
    title: 'Express'
  });
});
/* GET home page. */

router.get('/go', function (req, res, next) {
  res.render('Materialdetail', {
    title: 'Express'
  });
});
/* GET users listing. */

router.post('/receivexlxs', function (req, res, next) {
  var workbook = XLSX.readFile('BarcodeGenerator/public/spreadsheets/Plant_001_masterdata.xlsx');
  var sheet_name_list = workbook.SheetNames; //var 1`lfdcmsvg vfdc©grwMV  XIZHZGJB NEFWW  = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  var doc = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  res.send('respond with a resource');
}); // router.post('/submitLogin', function (req, res, next) {
// res.render("index", null);
// });

router.post('/submitLogin', function (req, res, next) {
  res.render("Materialdetail", null);
});
router.post('/getcodes', function (req, res, next) {
  var workbook = XLSX.readFile('BarcodeGenerator/public/spreadsheets/Plant_001_masterdata.xlsx');
  var sheet_name_list = workbook.SheetNames; //var 1`lfdcmsvg vfdc©grwMV  XIZHZGJB NEFWW  = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  var doc = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  var filtered = doc.filter(function (value) {
    return value.IRMS / GCAS === '91238465';
  });
  res.render("QRCodes", {
    title: 'list',
    matertialList: doc
  });
});
router.post('/generatepdf', function (req, res, next) {
  var material = req.body.material;
  var PO = req.body.PO;
  var batch = req.body.batch;
  var prdDate = req.body.prdDate;
  var quantity = req.body.quantity;
  var quantity1 = req.body.quantity1;
  var quantity2 = req.body.quantity2;
  var quantity3 = req.body.quantity3;
  var quantity4 = req.body.quantity4;
  var quantity5 = req.body.quantity5;
  var quantity6 = req.body.quantity6;
  var quantity7 = req.body.quantity7;
  var workbook = XLSX.readFile(__dirname + '/Plant_001_masterdata.xlsx'); //var workbook = XLSX.readFile(__dirname + '/My First Project-087f0a546d01.json');

  var sheet_name_list = workbook.SheetNames;
  var doc = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  var filtered = doc.filter(function (value) {
    return value.IRMSGCAS === parseInt(material);
  });

  if (filtered.length <= 0) {
    res.render('Materialdetail');
  } else {
    var dataFormated = filtered[0];
    var row1Text = "(91) ".concat(dataFormated.IRMSGCAS, "(37)").concat(quantity);
    var row2Text = "(10)AHNL".concat(batch, "~(90)NONE");
    var row3Text = "(00) 1 1534145 40011".concat(quantity6, " 9");
    GenerateBarCodeForNumber("91".concat(dataFormated.IRMSGCAS, "37").concat(quantity)).then(function (image1) {
      GenerateBarCodeForNumber("10AHNL".concat(batch, "90")).then(function (image2) {
        GenerateBarCodeForNumber("001153414540011".concat(quantity6, "9")).then(function (image3) {
          dataFormated.lotNumber = batch;
          dataFormated.prdDate = prdDate;
          dataFormated.quantity = quantity;
          dataFormated.quantity1 = quantity1;
          dataFormated.quantity2 = quantity2;
          dataFormated.quantity3 = quantity3;
          dataFormated.quantity4 = quantity4;
          dataFormated.quantity5 = quantity5;
          dataFormated.quantity6 = quantity6;
          dataFormated.quantity7 = quantity7;
          dataFormated.PO = PO;
          dataFormated.rowImage1 = {
            png: image1,
            number: row1Text
          };
          dataFormated.rowImage2 = {
            png: image2,
            number: row2Text
          };
          dataFormated.rowImage3 = {
            png: image3,
            number: row3Text
          };
          generatePdf(formatPDFWithData(filtered[0]), function (cb) {
            res.contentType("application/pdf");
            res.send(cb);
          });
        })["catch"](function (error) {});
      })["catch"](function (err) {});
    })["catch"](function (err) {});
  }
});
router.post('/login', function (req, res) {
  var workbook = XLSX.readFile(__dirname + '/Plant_userdata.xlsx');
  var doc = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  var filtered = doc.filter(function (value) {
    return value.Username == req.body.username;
  });

  if (filtered.length > 0) {
    if (filtered[0].Password == req.body.pass) {
      res.render('Materialdetail');
    } else {
      res.status(401).render('home');
    }
  } else {
    res.status(401).render('home');
  }
});

function generatePdf(docDefinition, callback) {
  try {
    var fonts = {
      Roboto: {
        normal: path.join(__dirname, './../fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, './../fonts/Roboto-Medium.ttf'),
        italics: path.join(__dirname, './../fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, './../fonts/Roboto-Italic.ttf')
      }
    };
    var printer = new pdfMakePrinter(fonts);
    var doc = printer.createPdfKitDocument(docDefinition);
    var chunks = [];
    doc.on('data', function (chunk) {
      chunks.push(chunk);
    });
    doc.on('end', function () {
      var result = Buffer.concat(chunks);
      callback(result);
    });
    doc.end();
  } catch (err) {
    throw err;
  }
}

;

function GenerateBarCodeForNumber(number) {
  return new Promise(function (resolve, reject) {
    var canvas = new Canvas();
    JsBarcode(canvas, number, {
      format: "CODE128",
      displayValue: false
    });
    canvas.toDataURL(function (err, png) {
      if (err) {
        reject(err);
      } else {
        resolve(png);
      }
    });
  });
}

function formatPDFWithData(data) {
  var _ref;

  var formatPDF = {
    pageMargins: [5, 5, 5, 5],
    pageSize: {
      width: 440.28,
      height: 'auto'
    },
    content: [{
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [[[(_ref = {
          text: data.Suppliername,
          style: 'subheader',
          align: 'right'
        }, _defineProperty(_ref, "text", data.Supplierlocation), _defineProperty(_ref, "style", 'subheader'), _defineProperty(_ref, "margin", [35, 0, 10, 0]), _ref)], [{
          text: "Supplier Product: ".concat(data.Supplierproduct),
          style: 'subheader',
          margin: [25, 0, 10, 0]
        }, {
          text: "IRMS GCAS: ".concat(data.IRMSGCAS),
          style: 'subheader',
          margin: [25, 0, 10, 0]
        }, {
          text: "Prod Date: ".concat(data.prdDate),
          style: 'subheader',
          margin: [25, 0, 10, 0]
        }]], [{
          text: "ITEM: ".concat(data.MaterialDescription),
          style: 'subheader',
          color: 'black',
          align: 'right',
          colSpan: 2
        }], [[{
          text: "WIDTH (MM):                 HEIGHT (MM):          ".concat(data.WIDTH, "                   \t\t\t\t   ").concat(data.quantity1, " "),
          style: 'subheader'
        }], [{
          text: "GROSS wt.(KG):          NET wt.(KG):           ".concat(data.quantity2, "                   \t\t\t\t   ").concat(data.quantity3),
          style: 'subheader'
        }]], [[{
          text: "ROLL Dia(MM):      ROLLS(BLK)(MM):   ".concat(data.ROLLDIAMETER, "               \t\t\t\t   ").concat(data.quantity4, " "),
          style: 'subheader'
        }], [{
          text: "SPLICES:          BASIS WEIGHT(GSM):           ".concat(data.quantity5, "                   \t\t\t\t   ").concat(data.BASISWEIGHT, " "),
          style: 'subheader'
        }]], [[{
          text: "IRMS GCAS#: ".concat(data.IRMSGCAS),
          style: 'subheader'
        }], [{
          text: "QUANTITY: ".concat(data.quantity, " ").concat(data.manROLLSBLOCKS),
          style: 'subheader'
        }]], [[{
          text: "LOT#: AHNL".concat(data.lotNumber),
          style: 'subheader'
        }], [{
          text: "PO: ".concat(data.PO),
          style: 'subheader'
        }]], [[{
          text: "CUSTOMER REF.: ",
          style: 'subheader'
        }], [{
          text: "PALLETS / BUNDLE : ".concat(data.quantity6),
          style: 'subheader'
        }]], [{
          stack: [{
            image: data.rowImage1.png,
            width: 200,
            height: 65
          }, {
            text: data.rowImage1.number,
            style: 'subheader',
            margin: [10, 0, 10, 0]
          }],
          colSpan: 2,
          margin: [100, 0, 10, 0]
        }], [{
          stack: [{
            image: data.rowImage2.png,
            width: 200,
            height: 65
          }, {
            text: data.rowImage2.number,
            style: 'subheader',
            margin: [10, 0, 10, 0]
          }],
          colSpan: 2,
          margin: [100, 0, 10, 0]
        }], [{
          stack: [{
            image: data.rowImage3.png,
            width: 200,
            height: 65
          }, {
            text: data.rowImage3.number,
            style: 'subheader',
            margin: [10, 0, 10, 0]
          }],
          colSpan: 2,
          margin: [100, 0, 10, 0]
        }]]
      }
    }],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 0, 0, -10]
      },
      tableHeader: {
        bold: true,
        fontSize: 9,
        color: 'black'
      }
    },
    defaultStyle: {// alignment: 'justify'
    }
  };
  return formatPDF;
}

module.exports = router;
//# sourceMappingURL=index.dev.js.map
