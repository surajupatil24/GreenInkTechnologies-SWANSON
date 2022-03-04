var express = require('express');
var router = express.Router();
var XLSX = require('xlsx')

const path = require('path');

/* GET home page. */
router.get('/Home', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

/* GET home page. */
router.get('/Home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET users listing. */

router.post('/receivexlxs', function(req, res, next) {
  var workbook = XLSX.readFile('BarcodeGenerator/public/spreadsheets/Plant_userdata.xlsx');
  var sheet_name_list = workbook.SheetNames;
  //var 1`lfdcmsvg vfdc©grwMV  XIZHZGJB NEFWW  = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  var doc = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  res.send('respond with a resource');
});

router.post('/submitLogin', function(req, res, next){
  res.render("Materialdetail", null);
});

router.get('/contact', function(req, res, next){
  res.render("contact", null);
});

router.post('/getcodes', function(req, res, next) {
  var workbook = XLSX.readFile('BarcodeGenerator/public/spreadsheets/Plant_userdata.xlsx');
  var sheet_name_list = workbook.SheetNames;
  //var 1`lfdcmsvg vfdc©grwMV  XIZHZGJB NEFWW  = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  var doc = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  var filtered = doc.filter(function(value){ return value.IRMS/GCAS === '91238465'});

  res.render("QRCodes", {title:'list', matertialList : doc});
});


router.post('/generatepdf', function(req, res, next){
	const material = req.body.material;
  const PO = req.body.PO;
  const batch  = req.body.batch;
  const prdDate =  req.body.prdDate;
  const quantity =  req.body.quantity;
  console.log(__dirname);
  var workbook = XLSX.readFile(__dirname + '/Plant_userdata.xlsx');
  var sheet_name_list = workbook.SheetNames;
  //var 1`lfdcmsvg vfdc©grwMV  XIZHZGJB NEFWW  = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  var doc = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  var filtered = doc.filter(function(value){ return value.IRMSGCAS === parseInt(material)});
 const dataFormated = filtered[0];
 
 dataFormated.lotNumber = batch;
 dataFormated.prdDate = prdDate;
 dataFormated.quantity = quantity;
 dataFormated.PO = PO;

 generatePdf(formatPDFWithData(filtered[0]), cb =>{
	res.contentType("application/pdf");
	res.send(cb);
  });
  

 
});

function generatePdf(docDefinition, callback)  {

  try {
    var fonts = {
      Roboto: {
        normal: path.join(__dirname, './../fonts/Roboto-Regular.ttf'),
        bold:  path.join(__dirname, './../fonts/Roboto-Medium.ttf'),
        italics:  path.join(__dirname, './../fonts/Roboto-Italic.ttf'),
        bolditalics:  path.join(__dirname, './../fonts/Roboto-Italic.ttf')
      }
    };
    
    const printer = new pdfMakePrinter(fonts);
    const doc = printer.createPdfKitDocument(docDefinition);
    
    let chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });
  
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      callback(result);
    });
    
    doc.end();
    
  } catch(err) {
    throw(err);
  }
};


module.exports = router;
