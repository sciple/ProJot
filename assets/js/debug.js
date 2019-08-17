// function logIt(argument) {
//   // improve with a flag (i.e. warn,danger,success) and switch statement logIt(argument,flag)
//   console.log('%c ' + argument + ' ', 'color:#fff;background:salmon')
// }
//
// (function checkWorkSpace() {
//   console.log('------ WORKSPACE ------');
//   for (var variable in workSpace) {
//     if (workSpace.hasOwnProperty(variable)) {
//       logIt(variable)
//     }
//   }
// })();
//
// // (function checkDeleteFirstSentence() {
// //   $('#paragraph-container').append('<span class="testSentence">Edit me...</span>');
// //   deleteFirstEntry($('.testSentence'));
// // })();
//
// (function loopOverSelectedDOMelements() {
//   // $('#paragraph-container').append('<div id="writer-1"><span class="testSentence"> 1 </span></div><div id="writer-2"><span class="testSentence"> 2 </span></div>');
//   var paragraphs = $('#paragraph-container').children();
//   var numberOfParagraphs = paragraphs.length;
//   for (var i = 0; i < numberOfParagraphs; i++) {
//     d = $('#paragraph-container > #writer-'+1);
//     console.log(i);
//     console.log(d.val('').text());
//   }
//   // var d = $('#paragraph-container > #writer-1');
//   // var outputText = '';
//   // for (var i = 0; i < d.length; i++) {
//   //   outputText += d.val('').text();
//   // }
//   // console.log(outputText);
// })();
