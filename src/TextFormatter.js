var textSelected = false;
var isTextFormatterVisible = false;
var textFormatterElement = '<div id="highlightTooltip">'+
                            '<button onclick="document.execCommand(\'bold\', false, null)"><i class="material-icons">format_bold</i></button>'+
                            '<button onclick="document.execCommand(\'italic\', false, null)"><i class="material-icons">format_italic</i></button>'+
                            '<button onclick="document.execCommand(\'underline\', false, null)"><i class="material-icons">format_underline</i></button>'+
                            '<button onclick="changeSize(true)"><i class="material-icons">format_size</i><i class="material-icons">arrow_drop_up</i></button>'+
                            '<button onclick="changeSize(false)"><i class="material-icons">format_size</i><i class="material-icons">arrow_drop_down</i></button>'+
                            '</div>'

window.onload = (function() {
    document.querySelector('body').innerHTML += textFormatterElement;
});

document.onselectionchange = (function(e) {
    var text = getSelectedText();
    if (text !== '') {
        textSelected = true;
    } else {
        textSelected = false;
    }
});

document.onclick = (function(e) {
    var highlightTooltip = document.getElementById('highlightTooltip').outerHTML;
    if (highlightTooltip.indexOf(e.target.outerHTML) === -1 && isTextFormatterVisible) {
        document.getElementById('highlightTooltip').style.display = 'none';
        clearTimeout(delayedVisibleSetter);
        isTextFormatterVisible = false;
    }
});

document.onmouseup = document.onkeyup = (function() {
    if (textSelected) {
        var coords = getSelectionCoords();
        var highlightTooltip = document.getElementById('highlightTooltip');
        highlightTooltip.style.top = coords.y - 55 + 'px';
        highlightTooltip.style.left = coords.x - 50 + 'px';
        highlightTooltip.style.display = 'block';
        delayedVisibleSetter = setTimeout(function() {
            isTextFormatterVisible = true;
        }, 200);
    }
});

var changeSize = (function(increase) {
    var fontSize = document.queryCommandValue("FontSize") || 3;
    value = parseInt(fontSize) + parseInt(increase ? 1 : -1);
    document.execCommand('fontSize', false, value);
});

var getElementIndex = (function(node) {
    var index = 0;
    while (node = node.previousElementSibling) {
        index++;
    }
    return index;
});

var getSelectedText = (function() {
    if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.anchorNode && selection.anchorNode.parentNode.isContentEditable !== false) {
            return selection.toString();
        }
    }
    return '';
});

var getSelectionCoords = (function(win) {
    win = win || window;
    var doc = win.document;
    var sel = doc.selection, range, rects, rect;
    var x = 0, y = 0;
    if (sel) {
        if (sel.type !== "Control") {
            range = sel.createRange();
            range.collapse(true);
            x = range.boundingLeft;
            y = range.boundingTop;
        }
    } else if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
                range.collapse(true);
                rects = range.getClientRects();
                if (rects.length > 0) {
                    rect = rects[0];
                }
                x = rect.left;
                y = rect.top;
            }
            if (x === 0 && y === 0) {
                var span = doc.createElement("span");
                if (span.getClientRects) {
                    span.appendChild( doc.createTextNode("\u200b") );
                    range.insertNode(span);
                    rect = span.getClientRects()[0];
                    x = rect.left;
                    y = rect.top;
                    var spanParent = span.parentNode;
                    spanParent.removeChild(span);
                    spanParent.normalize();
                }
            }
        }
    }
    return { x: x, y: y };
});