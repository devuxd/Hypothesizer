

let backgroundPageConnection: chrome.runtime.Port;

const init = () => {
    backgroundPageConnection = chrome.runtime.connect({
        name: "Hypothesizer"
    });
    backgroundPageConnection.onMessage.addListener(function (message) {
        console.log("Received message from background.js");
        console.log(message);
    })
}

const sendMessageToBackground = (message: String) => {
    backgroundPageConnection.postMessage({
        name: message,
        tabId: chrome.devtools.inspectedWindow.tabId
    })
}
const getSourceCode = () => {
    // console.log(build_response({}))
    //below source code gets the compiled JS file with all scripts, not what we want
    // This code only get the source code that we want :)
    chrome.devtools.inspectedWindow.getResources(e => e.filter(obj => {
        if (obj.url.includes("src") && obj.url.includes("localhost")) {
            obj.getContent(e => console.log(e))
            console.log(obj)
        }
    }))
}

// following code was used from https://github.com/tomimick/chrome-ext-view-src

function build_response(request: any) {
    let arr_html: any = [], arr_js: any = [], arr_css: any = [], temp_html: any = [];

    var is_initial = !request;

    try {
        console.log("line 39")
        get_js(arr_js, arr_html, is_initial, true);
        console.log("line 41");
        var response = { "js": arr_js, "css": arr_css, "html": temp_html };

        // get html body + template scripts
        get_css(arr_css, is_initial);

        response.html = [{
            "inline": get_dom(),
            "count": document.getElementsByTagName('*').length
        }];
        for (var i = 0; i < arr_html.length; i++) {
            response.html.push(arr_html[i]);
        }
    } catch (e) {
        return { "err": "" + e };
    }

    return response;
}

// get body as string
function get_dom() {
    //    return document.documentElement.outerHTML;

    // truncate long scripts+styles in HTML, they are listed separately

    var dupNode = <Element>document.documentElement.cloneNode(true);

    function truncate(nodes: any) {
        var MAXLEN = 400;
        var i, s;
        for (i = 0; i < nodes.length; i++) {
            s = nodes[i].innerHTML;
            if (s && s.length > MAXLEN)
                nodes[i].innerHTML = s.substr(0, MAXLEN) + " truncated " + s.length + "bytes...";
        }
    }

    truncate(dupNode.getElementsByTagName("script"));
    truncate(dupNode.getElementsByTagName("style"));

    return dupNode.outerHTML;
}

// enumerate JS scripts in page
// returns 2 arrays: js and html content
function get_js(a: any, a_html: any, mark_initial: any, show_onclick: any) {
    var i, node;

    var nodes: HTMLCollectionOf<HTMLScriptElement> | NodeListOf<Element> = document.getElementsByTagName("script");
    console.log(nodes);
    for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if (!node.type || node.type === "text/javascript") {
            console.log("line 93");
            pick_node(node, a, mark_initial);
        }
        else if (node.type === "text/template"
            || node.type === "text/x-template"
            || node.type === "text/html") {
            console.log("line 99");
            pick_node(node, a_html, mark_initial);
        }
    }
    // inline onclick-handlers
    if (show_onclick) {
        nodes = document.querySelectorAll("*");
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (node.getAttribute("onclick")) {
                var item: { [k: string]: any } | null = {};
                item = pick_node(node, a, mark_initial);
                var s = "/* " + node.tagName.toLowerCase();
                if (node.id)
                    s += "#" + node.id;
                if (node.className)
                    s += "." + node.className;
                s += ".onclick = */\n";
                if (item !== null) {
                    item.inline = s + node.getAttribute("onclick");
                    item.src = null;
                    item.dynamic = false;
                    item.onclick = true;
                }
            }
        }
    }
}

// enumerate CSS in page
function get_css(a: any, mark_initial: any) {
    var i;

    var csslist = document.styleSheets;
    for (i = 0; i < csslist.length; i++) {
        var css = csslist[i];

        pick_node(css.ownerNode, a, mark_initial);

        parse_cssrules(css, a, mark_initial, 0);
    }

    /*
        var styles = document.getElementsByTagName("link");
        for(i=0; i<styles.length; i++){
            node = styles[i];
            if (node.rel === "stylesheet" || node.type === "text/css")
                pick_node(node, a, mark_initial);
        }
        styles = document.getElementsByTagName("style");
        for(i=0; i<styles.length; i++){
            node = styles[i];
            pick_node(node, a, mark_initial);
        }*/
}

// parse "@import file.css" declarations in given css file
function parse_cssrules(cssNode: any, a: any, mark_initial: any, depth: any) {
    if (depth > 10 || !cssNode)
        return;

    try {
        var rules = cssNode.cssRules;
    } catch (e) {
        // can't access all cssRules - Chrome 64 returns SecurityError
        // just ignore these items, they seem duplicates anyway
        //var item = {"src":"error "+cssNode.href};
        //a.push(item);
        return;
    }

    if (rules) {
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];

            if (rule instanceof CSSImportRule) {
                var s = rule.styleSheet;
                var item: { [k: string]: any } | null = pick_node({ 'href': s.href }, a, mark_initial);
                if (item !== null) item.imported = true;
                parse_cssrules(rule.styleSheet, a, mark_initial, depth + 1);
            }
        }
    }
}

// picks element's src-url or inline content
function pick_node(node: any, array: any, mark_initial: any) {
    // skip extension scripts
    var src = node.href || node.src;
    // if (src && startsWith(""+src, "chrome-extension:"))
    //     return null;

    var item: { [k: string]: any } = {};

    if (src)
        item = { "src": src };
    else
        item = { "inline": node.innerText };

    // mark initially loaded elems
    if (mark_initial)
        node._xinit = true;

    if (!node._xinit)
        item["dynamic"] = true;

    array.push(item);
    return item;
}

function startsWith(s: any, sub: any) {
    return s.indexOf(sub) === 0;
}

export { init, sendMessageToBackground, getSourceCode }

