// TO DO

// *** rewrite with cherrypy ***
// Read mode
// carriage returns must place space btw paragraphs!!!
// add category of words (for grammar)
// choose directory where to save
// give name to files
// !!! warn on releoad !!!
// Markdown parser / saver

var workspace = {
    initialContent: 'Edit me _ _ _',
    sentenceStart: '<span class="sentence" contenteditable="true" spellcheck="true" onkeyup="triggerConversion(this)" onclick="deleteFirstEntry(this)">',
    sentenceEnd: '</span>',
    sentenceWhiteSpace: ' ',
    checkEndSentence: ["!", ".", "?", '\r'], // How to split sentences (refactor to regexp!)
    paragraphSerialNumber: -1, // Serial number increased as new paragraphs are added
    savedText: [],
    loadedText: [],
    exportText: ''
};

function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function deleteFirstEntry(selectedElement) {
    var content = $(selectedElement).val('').text();
    if (content === workspace.initialContent) {
        $(selectedElement).val('').text('');
    }
}

function triggerConversion(selectedElement) {
    if (event.keyCode === 190 || event.keyCode === 13) {
        convertText(selectedElement);
    }
}

function convertText(selectedElement) {
    var copiedText = $(selectedElement).parent().val('').text();
    // if sentence does not have a full stop: add full-stop plus white space
    if (workspace.checkEndSentence.indexOf(copiedText[copiedText.length - 1]) === -1) {
        copiedText += '.' + workspace.sentenceWhiteSpace;
    }
    var sentences = copiedText.match(/[^\.!\?]+[\.!\?]+/g); // split sentence by [!.?]
    var parentElement = $(selectedElement).parent();
    parentElement.find('.sentence').remove();
    var outputText = workspace.sentenceStart +
        sentences.join(workspace.sentenceEnd + workspace.sentenceStart + workspace.sentenceWhiteSpace) +
        workspace.sentenceEnd +
        workspace.sentenceStart +
        workspace.sentenceEnd;
    parentElement.append(outputText);
    $('.sentence:last-child').focus();
}

function formatNote(textIN) {
    return '<div id="note"><a href="https://en.wikipedia.org/wiki/' + textIN + '" target="_blank" class="list-items">' + textIN + '</a ></div><hr>';
}

function createNote() {
    var selectedText = window.getSelection().toString();
    if (selectedText !== "") {
        $('#notes').append(formatNote(selectedText));
    } else {
        // insert error message here!
    }
}

function createParagraph() {
    workspace.paragraphSerialNumber += 1;
    $('#titles').append('<h5 id="title-' + workspace.paragraphSerialNumber + '" onclick="showParagraph(' + workspace.paragraphSerialNumber + ')" contenteditable=true> Write title</h5><hr>');
    $('#titles').children('h5').last().focus();
    $('#paragraph-container').append('<div class="paragraph" id="paragraph-' + workspace.paragraphSerialNumber + '" class="col-xs-12">' + workspace.sentenceStart + workspace.initialContent + workspace.sentenceEnd + '</div>');
}

function showParagraph(paragraphNumber) {
    $("#paragraph-container").children().hide();
    var selectedParagraph = '#paragraph-' + String(paragraphNumber);
    $(selectedParagraph).show();
}

function saveWork() {

    var r = confirm("Are You Sure You Want To OVERWRITE?");
    if (r === true) {
        // select note container, push to workspace as a separate array.
        // split into separate function !!!!
        var paragraphs = $('#paragraph-container').children();
        var numberOfParagraphs = paragraphs.length;
        workspace.savedText = []; // (~overwrite old content)
        //======================================================================
        var notes = $('#notes > div'); // save notes (unique container)
        //======================================================================
        for (var i = 0; i < numberOfParagraphs; i++) {
            var paragraphText = $('#paragraph-container > #paragraph-' + i).val('').text();
            var paragraphTitle = $('#title-' + i).val('').text();

            workspace.savedText.push({
                "title": paragraphTitle,
                "content": paragraphText.match(/[^\.!\?]+[\.!\?]+/g)
            });
        }
        for (var i = 0; i < workspace.savedText.length; i++) {
            workspace.exportText += '*' + workspace.savedText[i].title + '* ----------> ';
            for (var j = 0; j < workspace.savedText[i].content.length; j++) {
                workspace.exportText += workspace.savedText[i].content[j];
            }
        }
        // console.log(workspace.savedText);
        postData();
        exportData();
    }
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'assets/data/data.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadParagraph() {
    loadJSON(function(response) {
        var dataJSON = JSON.parse(response);
        console.log(dataJSON);
        for (var i = 0; i < dataJSON.length; i++) {
            $('#titles').append('<h5 id="title-' + i + '" onclick="showParagraph(' + i + ')" contenteditable=true> ' + dataJSON[i].title + ' </h5><hr>');
            $('#paragraph-container').append('<div class="paragraph" id="paragraph-' + i + '" class="col-xs-12"></div>');
            for (var sentenceLoaded = 0; sentenceLoaded < dataJSON[i].content.length; sentenceLoaded++) {
                $('#paragraph-' + i).append(workspace.sentenceStart + dataJSON[i].content[sentenceLoaded] + workspace.sentenceEnd);
            }
            //    $('#notes').append('<div><a href="https://en.wikipedia.org/wiki/' + dataJSON[i].notes + '" target="_blank" class="list-items">' + dataJSON[i].notes + '</a ></div><hr>');
        }
        workspace.paragraphSerialNumber = i - 1;
    });
}

function postData() {
    jsonObject = workspace.savedText;
    $.ajax({
        type: "POST",
        url: "assets/php/json.php",
        dataType: 'json',
        data: {
            json: JSON.stringify(jsonObject)
        }
    });
}

function exportData() {
    jsonObject = workspace.exportText;
    $.ajax({
        type: "POST",
        url: "assets/php/text.php",
        dataType: 'json',
        data: {
            json: JSON.stringify(jsonObject)
        }
    });
}

// Words and info for improving writing
// taken from : https://github.com/wyounas/homer/blob/master/homer/constants.py


// MAX_WORDS_IN_SENTENCE = 20

// MAX_SENTENCES_IN_PARAGRAPH = 6

// WORDS_ONE_READS_PER_MINUTE = 200

// VAGUE_WORDS = [
//     "approach", "approaches", 'assumption', "assumptions", 'concept', "concepts", 'condition',
//     "conditions", 'context', 'contexts', 'framework', 'frameworks', 'issue', 'issues', 'process',
//     'processes', 'range', 'role', 'roles', 'strategy', 'strategies', 'tendency', 'tendencies',
//     'variable', 'variables', 'perspective', 'perspectives',  'accrual', 'derivative', 'derivatives',
//     'fair value', 'portfolio', 'portfolios', 'audit', 'poverty', 'evaluation', 'evaluations', 'management',
//     'monitoring', 'effectiveness', 'performance', 'competitiveness', 'reform', 'assistance', 'growth',
//     'effort', 'capacity', 'transparency', 'effectiveness', 'progress', 'stability', 'protection', 'access',
//     'implementation', 'sustainable', 'stuff', 'really', 'etc', 'many', 'usually',
//     'most', 'somehow', 'somewhat', 'somewhat like', 'soon', 'a few'

// ]

// INTENSIFIERS = ['very', 'highly', 'extremely']

// COMPULSIVE_HEDGERS = [
//     'apparently', 'almost', 'fairly', 'nearly', 'partially', 'predominantly', 'presumably', 'rather', 'relative',
//     'seemingly', 'sort of', 'kind of', 'a bit', 'a little', 'maybe', 'some', 'partly', 'perhaps', 'any', 'probably',
//     'a touch', 'sometimes', 'mostly', 'possibly', 'might', 'a tad', 'hardly', 'seem'
// ]



