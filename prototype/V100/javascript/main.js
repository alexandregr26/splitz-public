// Splitz - Version 1.0.0

const blackVar = 'black';
const whiteVar = 'white';
var submitSectionVar = document.getElementById('sectionSubmit');
var textSectionVar = document.getElementById('sectionText');
var myFormVar = document.getElementById('myForm');
var footerVar = document.getElementById('myFooter');
var refreshButtonVar = document.getElementById('refreshButton');
var questionButtonVar = document.getElementById('questionButton');
var plusButtonVar = document.getElementById('plusTabButton');
var logoVar = document.getElementById('logo');
var containerVar = document.querySelector('.container');
var blackWhite;

chrome.storage.sync.get('chromeBackgroundVar', function (result) {
    blackWhite = result.chromeBackgroundVar;
    if (blackWhite == undefined) {
        blackWhite = true;
    }
    corcor();
});

function corcor() {
    if (blackWhite == false) {
        containerVar.style.background = blackVar;
        logoVar.style.color = whiteVar;
        logoVar.style.backgroundColor = blackVar;
    } else {
        containerVar.style.background = whiteVar;
        logoVar.style.color = blackVar;
        logoVar.style.backgroundColor = whiteVar;
    }
}

function backgroundColor() {
    if (blackWhite == true) {
        containerVar.style.background = blackVar;
        logoVar.style.color = whiteVar;
        logoVar.style.backgroundColor = blackVar;
        blackWhite = false;
    } else {
        containerVar.style.background = whiteVar;
        logoVar.style.color = blackVar;
        logoVar.style.backgroundColor = whiteVar;
        blackWhite = true;
    }

    chrome.storage.sync.set({ 'chromeBackgroundVar': blackWhite }, function () {

    });
}

logoVar.addEventListener("click", backgroundColor);

submitSectionVar.addEventListener("mouseenter", () => {
    textSectionVar.style.width = '60%';
});

myFormVar.addEventListener("mouseleave", () => {
    textSectionVar.style.width = '0%';
});

footerVar.addEventListener("mouseenter", () => {
    refreshButtonVar.style.opacity = '1';
    refreshButtonVar.style.transition = 'opacity 0.4s ease-in-out';
    questionButtonVar.style.opacity = '1';
    questionButtonVar.style.transition = 'opacity 0.4s ease-in-out';
});

footerVar.addEventListener("mouseleave", () => {
    refreshButtonVar.style.opacity = '0';
    refreshButtonVar.style.transition = 'opacity 0.4s ease-in-out';
    questionButtonVar.style.opacity = '0';
    questionButtonVar.style.transition = 'opacity 0.4s ease-in-out';
});

refreshButtonVar.addEventListener("click", () => {
    var previousTabsLoad = document.getElementById('tabsId');
    previousTabsLoad.remove();
    var nothing = false;;
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
        chrome.storage.sync.set({ 'splitzData': nothing }, function () {
        });
    });
    window.close();
});

questionButtonVar.addEventListener("click", () => {
    window.open('https://github.com/alexandregr26/splitz-public', '_blank');
});

var newSetup;
var chromeSetup;
collectData();

function collectData() {
    chrome.storage.sync.get('splitzData', function (resultR) {
        chromeSetup = resultR.splitzData;
        if (chromeSetup === undefined || chromeSetup === false) {
            newSetup = true;
            newLoad();
        } else {
            newSetup = false;
            previousLoad();
        }
    });
}

function previousLoad() {
    var tabsDatas = [];
    function TabData(ntabs, url, id, tabPosition, ulvarPosition, title, color) {
        this.ntabs = ntabs;
        this.url = url;
        this.id = id;
        this.tabPosition = tabPosition;
        this.ulvarPosition = ulvarPosition;
        this.title = title;
        this.color = color;
    }

    var newDiv = document.createElement('div');
    newDiv.className = 'tabsBox';
    newDiv.id = 'tabsId';
    var ulVar = document.createElement('ul');
    ulVar.className = 'ulClass';
    ulVar.id = 'dropzone';
    newDiv.appendChild(ulVar);

    var currNumberTabs;
    var prevNumberTabs = chromeSetup[0].ntabs;
    var orderedChromeSetup = [];

    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
        currNumberTabs = tabs.length;
        checkTabs = 0;
        if (currNumberTabs < chromeSetup[0].ntabs) {
            var onlyTabsUrlMatch = [];
            var interationCheck = false;
            var ulVarCheck = 0;
            while (interationCheck != true) {
                for (let i = 0; i < chromeSetup.length; i++) {
                    if (chromeSetup[i].ulvarPosition == ulVarCheck) {
                        if (chromeSetup[i].url != undefined) {
                            onlyTabsUrlMatch.push(chromeSetup[i].url);
                        }
                        ulVarCheck = ulVarCheck + 1;
                        break;
                    }
                }
                if (ulVarCheck == chromeSetup.length) {
                    interationCheck = true;
                }
            }
            for (let i = 0; i < currNumberTabs; i++) {
                if (tabs[i].url == onlyTabsUrlMatch[i]) {
                    checkTabs = checkTabs + 1;
                } else {
                    break;
                }
            }

            var ratio = (checkTabs / currNumberTabs) * (100);
            if (ratio >= 50) {
                rearrangeTabs();
                if (chromeSetup.length > prevNumberTabs) {
                    loadPreviousData();
                } else {
                    newLoad();
                }
            } else {
                newLoad();
            }
        } else {
            var onlyTabsUrlMatch = [];
            var interationCheck = false;
            var ulVarCheck = 0;
            while (interationCheck != true) {
                for (let i = 0; i < chromeSetup.length; i++) {
                    if (chromeSetup[i].ulvarPosition == ulVarCheck) {
                        if (chromeSetup[i].url != undefined) {
                            onlyTabsUrlMatch.push(chromeSetup[i].url);
                        }
                        ulVarCheck = ulVarCheck + 1;
                        break;
                    }
                }
                if (ulVarCheck == chromeSetup.length) {
                    interationCheck = true;
                }
            }
            for (let i = 0; i < prevNumberTabs; i++) {

                var httpCheck = 0;
                var httpExample = ['h', 't', 't', 'p', 's', ':', '/', '/', 'w', 'w', 'w', '.'];
                if ((tabs[i].url.length >= 7) && (onlyTabsUrlMatch[i].length >= 7)) {
                    for (let j = 0; j < 8; j++) {
                        if ((tabs[i].url[j] == httpExample[j]) && (onlyTabsUrlMatch[i][j] == httpExample[j])) {
                            httpCheck++;
                        }
                    }
                }

                if (httpCheck == 8) {
                    var checked = true;
                    for (let j = 8; tabs[i].url[j] != '/'; j++) {
                        if (tabs[i].url[j] == onlyTabsUrlMatch[i][j]) {
                        } else {
                            checked = false;
                            break;
                        }
                    }
                } else {
                    if (tabs[i].url == onlyTabsUrlMatch[i]) {
                        checkTabs = checkTabs + 1;
                    } else {
                        break;
                    }
                }

                if (checked == true){
                    checkTabs = checkTabs + 1;
                }
            }

            var ratio = (checkTabs / prevNumberTabs) * (100);
            if (ratio >= 50) {
                rearrangeTabs();
                if (chromeSetup.length > prevNumberTabs) {
                    loadPreviousData();
                } else {
                    newLoad();
                }
            } else {
                newLoad();
            }
        }
    });

    function loadPreviousData() {
        chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
            var tabsType = 0;
            var tabsCount = 0;
            var colorCount = 0;
            var countedCount = 0;
            for (let i = 0; i < orderedChromeSetup.length; i++) {
                if (orderedChromeSetup[i].url == undefined) {
                    var formData = orderedChromeSetup[i].title;
                    var sectionValueString = String(formData);
                    var lls = document.createElement('li');
                    lls.className = 'node';
                    lls.title = 'ss';
                    var idNumber = i;
                    lls.id = idNumber;
                    var circle = document.createElement('i');
                    circle.className = "fa fa-circle";
                    circle.style.color = orderedChromeSetup[i].color;
                    circle.style.fontSize = '14px';
                    circle.style.paddingRight = '16px';
                    circle.style.paddingLeft = '8px';
                    circle.style.paddingTop = '5px';
                    lls.appendChild(circle);
                    var newDivText = document.createTextNode(sectionValueString);
                    lls.appendChild(newDivText);
                    var theSpan2 = document.createElement('button');
                    theSpan2.className = 'xCloseForm';
                    theSpan2.id = idNumber;
                    var closeIcon = document.createElement('i');
                    closeIcon.className = 'fa fa-close'
                    closeIcon.style.fontSize = '18px';
                    closeIcon.style.color = orderedChromeSetup[i].color;
                    theSpan2.appendChild(closeIcon);
                    theSpan2.style.background = 'none';
                    theSpan2.style.border = 'none';
                    theSpan2.style.color = '#323232';
                    theSpan2.style.cursor = 'pointer';
                    theSpan2.style.position = 'fixed';
                    theSpan2.style.left = '88%';
                    theSpan2.style.display = 'none';
                    lls.appendChild(theSpan2);
                    lls.style.display = 'flex';
                    lls.style.overflow = 'hidden';
                    lls.style.padding = '5px 5px 5px';
                    lls.style.margin = '11px 0';
                    if (blackWhite == false) {
                        lls.style.background = '#262626';
                        lls.style.color = whiteVar;
                    } else {
                        lls.style.background = '#FCFCFC';
                    }
                    lls.style.borderRadius = '10px';
                    lls.style.borderStyle = 'solid';
                    lls.style.borderColor = orderedChromeSetup[i].color;
                    lls.style.transition = '0.4s';
                    lls.style.transform = 'scale(1)';
                    lls.style.fontFamily = 'EurofurenceBold';
                    lls.style.fontSize = '22px';
                    lls.style.letterSpacing = '0.5px';
                    lls.style.verticalAlign = 'middle';
                    lls.style.cursor = 'pointer';
                    lls.draggable = 'true';
                    ulVar.appendChild(lls);
                    var tabproto = new TabData;
                    tabproto.title = sectionValueString;
                    tabproto.color = orderedChromeSetup[i].color;
                    tabproto.id = idNumber;
                    colorCount = colorCount + 1;
                    tabproto.ntabs = tabs.length;
                    tabsDatas.push(tabproto);
                } else {
                    if (tabsCount == checkTabs) {
                        break;
                    }
                    tabsCount = tabsCount + 1;
                    var tabproto = new TabData;
                    tabproto.ntabs = tabs.length;
                    tabproto.url = orderedChromeSetup[i].url;
                    tabproto.id = i;
                    tabproto.tabPosition = orderedChromeSetup[i].tabPosition;
                    tabsDatas.push(tabproto);
                    var ll = document.createElement('li');
                    ll.className = 'node';
                    var idNumber = i;
                    ll.id = idNumber;
                    var imgVar = document.createElement("img");
                    if (tabs[tabsType].favIconUrl == "" || tabs[tabsType].title == "New Tab") {
                        imgVar.src = 'https://www.google.com/images/icons/product/chrome-32.png';
                    } else {
                        imgVar.src = tabs[tabsType].favIconUrl;
                    }
                    imgVar.style.width = '45px';
                    imgVar.style.height = '20px';
                    imgVar.style.paddingRight = '20px';
                    imgVar.style.paddingLeft = '5px';
                    ll.appendChild(imgVar);
                    var textTab = tabs[tabsType].title;
                    var length = 20;
                    var trimmedString = textTab.substring(0, length);
                    var newDivText = document.createTextNode(trimmedString);
                    ll.appendChild(newDivText);
                    var theSpan = document.createElement('button');
                    theSpan.className = 'xClose';
                    theSpan.id = idNumber;
                    var closeIcon = document.createElement('i');
                    closeIcon.className = 'fa fa-close'
                    closeIcon.style.fontSize = '18px';
                    closeIcon.style.color = '#323232';
                    theSpan.appendChild(closeIcon);
                    theSpan.style.background = 'none';
                    theSpan.style.border = 'none';
                    theSpan.style.color = '#323232';
                    theSpan.style.cursor = 'pointer';
                    theSpan.style.position = 'fixed';
                    theSpan.style.left = '88%';
                    theSpan.style.display = 'none';
                    ll.appendChild(theSpan);
                    ulVar.appendChild(ll);
                    ll.style.display = 'flex';
                    ll.style.overflow = 'hidden';
                    ll.style.padding = '10px 5px 10px';
                    ll.style.margin = '11px 0';
                    if (blackWhite == false) {
                        ll.style.background = '#262626';
                        ll.style.color = whiteVar;
                    } else {
                        ll.style.background = '#FCFCFC';
                    }
                    ll.style.borderRadius = '10px';
                    ll.style.transition = '0.4s';
                    ll.style.transform = 'scale(1)';
                    ll.style.fontFamily = 'Eurofurence';
                    ll.style.fontSize = '20px';
                    ll.style.letterSpacing = '0.5px';
                    ll.style.verticalAlign = 'middle';
                    ll.style.cursor = 'pointer';
                    ll.draggable = 'true';
                    tabsType = tabsType + 1;
                }
                countedCount = countedCount + 1;
            }

            var numberNode = countedCount;
            if (tabs.length > tabsCount) {
                for (let i = tabsType; i < tabs.length; i++) {
                    tabsCount = tabsCount + 1;
                    var tabproto = new TabData;
                    tabproto.url = tabs[i].url;
                    tabproto.ntabs = tabs.length;
                    tabproto.id = numberNode;
                    tabproto.tabPosition = i;
                    tabsDatas.push(tabproto);
                    var ll = document.createElement('li');
                    ll.className = 'node';
                    ll.id = numberNode;
                    var imgVar = document.createElement("img");
                    if (tabs[tabsType].favIconUrl == "" || tabs[tabsType].title == "New Tab") {
                        imgVar.src = 'https://www.google.com/images/icons/product/chrome-32.png';
                    } else {
                        imgVar.src = tabs[tabsType].favIconUrl;
                    }
                    imgVar.style.width = '45px';
                    imgVar.style.height = '20px';
                    imgVar.style.paddingRight = '20px';
                    imgVar.style.paddingLeft = '5px';
                    ll.appendChild(imgVar);
                    var textTab = tabs[tabsType].title;
                    var length = 20;
                    var trimmedString = textTab.substring(0, length);
                    var newDivText = document.createTextNode(trimmedString);
                    ll.appendChild(newDivText);
                    var theSpan = document.createElement('button');
                    theSpan.className = 'xClose';
                    theSpan.id = numberNode;
                    var closeIcon = document.createElement('i');
                    closeIcon.className = 'fa fa-close'
                    closeIcon.style.fontSize = '18px';
                    closeIcon.style.color = '#323232';
                    theSpan.appendChild(closeIcon);
                    theSpan.style.background = 'none';
                    theSpan.style.border = 'none';
                    theSpan.style.color = '#323232';
                    theSpan.style.cursor = 'pointer';
                    theSpan.style.position = 'fixed';
                    theSpan.style.left = '88%';
                    theSpan.style.display = 'none';
                    ll.appendChild(theSpan);
                    ulVar.appendChild(ll);
                    ll.style.display = 'flex';
                    ll.style.overflow = 'hidden';
                    ll.style.padding = '10px 5px 10px';
                    ll.style.margin = '11px 0';
                    if (blackWhite == false) {
                        ll.style.background = '#262626';
                        ll.style.color = whiteVar;
                    } else {
                        ll.style.background = '#FCFCFC';
                    }
                    ll.style.borderRadius = '10px';
                    ll.style.transition = '0.4s';
                    ll.style.transform = 'scale(1)';
                    ll.style.fontFamily = 'Eurofurence';
                    ll.style.fontSize = '20px';
                    ll.style.letterSpacing = '0.5px';
                    ll.style.verticalAlign = 'middle';
                    ll.style.cursor = 'pointer';
                    ll.draggable = 'true';
                    tabsType = tabsType + 1;
                    numberNode = numberNode + 1;
                }
            }
            newDiv.style.fontSize = '14px';
            newDiv.style.wordWrap = 'break-word';
            ulVar.style.width = '100%';
            ulVar.style.paddingLeft = '10px';
            ulVar.style.paddingRight = '10px';
            ulVar.style.paddingBottom = '25px';
            ulVar.style.paddingTop = '25px';
            ulVar.style.boxSizing = 'border-box';

            var sectionColours = ["#E30022", "#FF8B00", "#FEE72F", "#03C03C", "#1F75FE", "#662B7E"]
            var countColours = 0;

            var containerVV = document.querySelector('.tabs-category');
            var h1VV = document.querySelector('.h1V');
            containerVV.insertBefore(newDiv, h1VV);

            var dropzone = document.getElementById('dropzone');
            var nodes = document.getElementsByClassName('node');
            var selectedNode = '';
            var selectedNodePos = 0;
            updateNodes();

            var myTabsIdArray = [];
            function tabsBundle(id, tposition, rposition) {
                this.id = id;
                this.tposition = tposition;
                this.rposition = rposition;
            }
            tabb();
            function tabb() {
                tabIncrement = 0;
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].title == '') {
                        var tabBundleProto = new tabsBundle;
                        tabBundleProto.id = parseInt((nodes[i].id), 10);
                        tabBundleProto.tposition = tabIncrement;
                        tabIncrement = tabIncrement + 1;
                        myTabsIdArray.push(tabBundleProto);
                    }
                }
            }

            function updateNodes() {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].addEventListener('click', (ev) => {
                        var spanX = (ev.target);
                        var tabNN;
                        for (var i = 0; i < myTabsIdArray.length; i++) {
                            if (spanX.id == myTabsIdArray[i].id) {
                                tabNN = myTabsIdArray[i].tposition;
                                chrome.tabs.update(tabs[tabNN].id, { active: true, highlighted: true });
                            }
                        }
                    });
                    nodes[i].children[1].addEventListener('click', (ev) => {
                        var spanX = (ev.target).parentElement.parentElement;
                        ulVar.removeChild(spanX);
                        var tabNN;
                        if (spanX.title == 'ss') {
                            for (var j = 0; j < tabsDatas.length; j++) {
                                if (spanX.id == tabsDatas[j].id) {
                                    tabsDatas.splice(j, 1);
                                    tabPosIncrement = 0;
                                    for (let z = 0; z < nodes.length; z++) {
                                        if (tabsDatas[z].color == undefined) {
                                            tabsDatas[z].tabPosition = tabPosIncrement;
                                            tabPosIncrement = tabPosIncrement + 1;
                                        }
                                        tabsDatas[z].ulvarPosition = z;
                                    }
                                    chrome.storage.sync.set({ 'splitzData': tabsDatas }, function () {
                                    });
                                }
                            }
                        } else {
                            for (var i = 0; i < myTabsIdArray.length; i++) {
                                if (spanX.id == myTabsIdArray[i].id) {
                                    tabNN = myTabsIdArray[i].tposition;
                                    chrome.tabs.remove(tabs[tabNN].id, function () { });
                                    for (var j = 0; j < tabsDatas.length; j++) {
                                        if (spanX.id == tabsDatas[j].id) {
                                            var prevtabsN = tabsDatas[0].ntabs;
                                            var currtabsN = prevtabsN - 1;
                                            for (var t = 0; t < tabsDatas.length; t++) {
                                                tabsDatas[t].ntabs = currtabsN;
                                            }
                                            tabsDatas.splice(j, 1);
                                            tabPosIncrement = 0;
                                            for (let z = 0; z < nodes.length; z++) {
                                                if (tabsDatas[z].color == undefined) {
                                                    tabsDatas[z].tabPosition = tabPosIncrement;
                                                    tabPosIncrement = tabPosIncrement + 1;
                                                }
                                                tabsDatas[z].ulvarPosition = z;
                                            }
                                            chrome.storage.sync.set({ 'splitzData': tabsDatas }, function () {
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                    nodes[i].addEventListener('mouseenter', (ev) => {
                        var spanX = document.getElementById(ev.target.id);
                        spanX.children[1].style.display = 'block';
                    });
                    nodes[i].addEventListener('mouseleave', (ev) => {
                        var spanX = document.getElementById(ev.target.id);
                        spanX.children[1].style.display = 'none';
                    });
                    nodes[i].addEventListener('mouseenter', (ev) => {
                        if (blackWhite == false) {
                            document.getElementById(ev.target.id).style.background = '#808080';
                            document.getElementById(ev.target.id).style.color = whiteVar;
                        } else {
                            document.getElementById(ev.target.id).style.color = blackVar;
                            document.getElementById(ev.target.id).style.background = '#dadada';
                        }
                    });
                    nodes[i].addEventListener('mouseleave', (ev) => {
                        if (blackWhite == false) {
                            document.getElementById(ev.target.id).style.background = '#262626';
                        } else {
                            document.getElementById(ev.target.id).style.background = '#FCFCFC';
                        }
                    });
                    nodes[i].addEventListener('mouseenter', (ev) => {
                        document.getElementById(ev.target.id).style.transform = 'scale(1.03)';
                    });
                    nodes[i].addEventListener('mouseleave', (ev) => {
                        document.getElementById(ev.target.id).style.transform = 'scale(1.0)';
                    });
                    nodes[i].addEventListener('mousedown', (ev) => {
                        var spanX = document.getElementById(ev.target.id);
                        if (spanX != null) spanX.style.backgroundColor = '#bfbfbf';
                    });
                    nodes[i].addEventListener('dragstart', (ev) => {
                        selectedNode = document.getElementById(ev.target.id);
                        setTimeout(() => {
                            dropzone.removeChild(selectedNode);
                        }, 100);
                    });
                }
                updateTabPositionData();
            }

            function updateTabPositionData() {
                var ulvarArray = [];
                for (let i = 0; i < nodes.length; i++) {
                    var strToNum = parseInt((nodes[i].id), 10);
                    ulvarArray.push(strToNum);
                }
                for (let k = 0; k < nodes.length; k++) {
                    for (let l = 0; l < ulvarArray.length; l++) {
                        if (k == ulvarArray[l]) {
                            tabsDatas[k].ulvarPosition = l;
                        }
                    }
                }
                chrome.storage.sync.set({ 'splitzData': tabsDatas }, function () {
                });
            }

            dropzone.addEventListener('dragover', (ev) => {
                ev.preventDefault();
                mouseLocation(ev.clientY);
            });

            dropzone.addEventListener('drop', (ev) => {
                ev.preventDefault();
                dropzone.insertBefore(selectedNode, dropzone.children[selectedNodePos]);

                setTimeout(() => {
                    if (blackWhite == false) {
                        selectedNode.style.backgroundColor = '#262626';
                    } else {
                        selectedNode.style.backgroundColor = '#FCFCFC';
                    }
                }, 200);

                var kz = 0;
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].title == '') {
                        for (let j = 0; j < myTabsIdArray.length; j++) {
                            if (nodes[i].id == myTabsIdArray[j].id) {
                                myTabsIdArray[j].rposition = kz;
                                chrome.tabs.move(tabs[(myTabsIdArray[j].tposition)].id, { index: (myTabsIdArray[j].rposition) });
                            }
                        }
                        kz = kz + 1;
                    }
                }
                for (let i = 0; i < nodes.length; i++) {
                    if (tabsDatas[i].color == undefined) {
                        for (let j = 0; j < myTabsIdArray.length; j++) {
                            if (tabsDatas[i].id == myTabsIdArray[j].id) {
                                tabsDatas[i].tabPosition = myTabsIdArray[j].rposition;
                            }
                        }
                    }
                }
                updateTabPositionData();
            });

            function establishNodePositions() {
                for (var i = 0; i < nodes.length; i++) {
                    var element = document.getElementById(nodes[i]['id']);
                    var position = element.getBoundingClientRect();
                    var yTop = position.top;
                    var yBottom = position.bottom;
                    nodes[i]['yPos'] = yTop + ((yBottom - yTop) / 2);
                }
            }

            function mouseLocation(currentYPos) {
                establishNodePositions();
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i]['yPos'] < currentYPos) {
                        var nodeAbove = document.getElementById(nodes[i]['id']);
                        selectedNodePos = i + 1;
                    }
                }

                if (typeof nodeAbove == 'undefined') {
                    selectedNodePos = 0;
                }
            }

            submitSectionVar.addEventListener("click", (e) => {
                if (textSectionVar.value === '') {
                    alert('No blank values allowed');
                } else {
                    if (colorCount > 5) colorCount = 0;
                    e.preventDefault();
                    var formData = document.getElementById('sectionText').value;
                    document.getElementById('sectionText').value = '';
                    var sectionValueString = String(formData);
                    var lls = document.createElement('li');
                    lls.className = 'node';
                    var idNumber = nodes.length;
                    lls.id = idNumber;
                    var circle = document.createElement('i');
                    circle.className = "fa fa-circle";
                    circle.style.color = sectionColours[colorCount];
                    circle.style.fontSize = '14px';
                    circle.style.paddingRight = '16px';
                    circle.style.paddingLeft = '8px';
                    circle.style.paddingTop = '5px';
                    lls.appendChild(circle);
                    var newDivText = document.createTextNode(sectionValueString);
                    lls.appendChild(newDivText);
                    var theSpan2 = document.createElement('button');
                    theSpan2.className = 'xCloseForm';
                    theSpan2.id = idNumber;
                    var closeIcon = document.createElement('i');
                    closeIcon.className = 'fa fa-close'
                    closeIcon.style.fontSize = '18px';
                    closeIcon.style.color = sectionColours[colorCount];
                    theSpan2.appendChild(closeIcon);
                    theSpan2.style.background = 'none';
                    theSpan2.style.border = 'none';
                    theSpan2.style.color = '#323232';
                    theSpan2.style.cursor = 'pointer';
                    theSpan2.style.position = 'fixed';
                    theSpan2.style.left = '88%';
                    theSpan2.style.display = 'none';
                    lls.appendChild(theSpan2);
                    lls.style.display = 'flex';
                    lls.style.overflow = 'hidden';
                    lls.style.padding = '5px 5px 5px';
                    lls.style.margin = '11px 0';
                    if (blackWhite == false) {
                        lls.style.background = '#262626';
                        lls.style.color = whiteVar;
                    } else {
                        lls.style.background = '#FCFCFC';
                    }
                    lls.style.borderRadius = '10px';
                    lls.style.borderStyle = 'solid';
                    lls.style.borderColor = sectionColours[colorCount];
                    lls.style.transition = '0.4s';
                    lls.style.transform = 'scale(1)';
                    lls.style.fontFamily = 'EurofurenceBold';
                    lls.style.fontSize = '22px';
                    lls.style.letterSpacing = '0.5px';
                    lls.style.verticalAlign = 'middle';
                    lls.style.cursor = 'pointer';
                    lls.draggable = 'true';
                    ulVar.appendChild(lls);
                    var tabproto = new TabData;
                    tabproto.title = sectionValueString;
                    tabproto.id = idNumber;
                    tabproto.color = sectionColours[colorCount];
                    tabproto.ntabs = tabs.length;
                    tabsDatas.push(tabproto);
                    updateNodes();
                    colorCount = colorCount + 1;
                    if (colorCount > 5) colorCount = 0;
                }
            });

            function newTabChrome() {
                chrome.tabs.create({ 'url': "chrome://newtab", 'active': true }, function (tab) {
                });
            }

            plusButtonVar.addEventListener("click", newTabChrome);
        });
    }

    function rearrangeTabs() {
        for (let i = 0; i < chromeSetup.length; i++) {
            for (let j = 0; j < chromeSetup.length; j++) {
                if (i == chromeSetup[j].ulvarPosition) {
                    orderedChromeSetup.push(chromeSetup[j]);
                }
            }
        }
    }
}

function newLoad() {
    var tabsDatas = [];
    function TabData(ntabs, url, id, tabPosition, ulvarPosition, title, color) {
        this.ntabs = ntabs;
        this.url = url;
        this.id = id;
        this.tabPosition = tabPosition;
        this.ulvarPosition = ulvarPosition;
        this.title = title;
        this.color = color;
    }

    var newDiv = document.createElement('div');
    newDiv.className = 'tabsBox';
    newDiv.id = 'tabsId';
    var ulVar = document.createElement('ul');
    ulVar.className = 'ulClass';
    ulVar.id = 'dropzone';
    newDiv.appendChild(ulVar);

    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
        for (let i = 0; i < tabs.length; i++) {
            var tabproto = new TabData;
            tabproto.ntabs = tabs.length;
            tabproto.url = tabs[i].url;
            tabproto.id = i;
            tabproto.tabPosition = i;
            tabsDatas.push(tabproto);

            var ll = document.createElement('li');
            ll.className = 'node';
            var idNumber = i;
            ll.id = idNumber;

            var imgVar = document.createElement("img");
            if (tabs[i].favIconUrl == "" || tabs[i].title == "New Tab") {
                imgVar.src = 'https://www.google.com/images/icons/product/chrome-32.png';
            } else {
                imgVar.src = tabs[i].favIconUrl;
            }
            imgVar.style.width = '45px';
            imgVar.style.height = '20px';
            imgVar.style.paddingRight = '20px';
            imgVar.style.paddingLeft = '5px';
            ll.appendChild(imgVar);
            var textTab = tabs[i].title;
            var length = 20;
            var trimmedString = textTab.substring(0, length);
            var newDivText = document.createTextNode(trimmedString);
            ll.appendChild(newDivText);
            var theSpan = document.createElement('button');
            theSpan.className = 'xClose';
            theSpan.id = idNumber;
            var closeIcon = document.createElement('i');
            closeIcon.className = 'fa fa-close'
            closeIcon.style.fontSize = '18px';
            closeIcon.style.color = '#323232';
            theSpan.appendChild(closeIcon);
            theSpan.style.background = 'none';
            theSpan.style.border = 'none';
            theSpan.style.color = '#323232';
            theSpan.style.cursor = 'pointer';
            theSpan.style.position = 'fixed';
            theSpan.style.left = '88%';
            theSpan.style.display = 'none';
            ll.appendChild(theSpan);
            ulVar.appendChild(ll);
            ll.style.display = 'flex';
            ll.style.overflow = 'hidden';
            ll.style.padding = '10px 5px 10px';
            ll.style.margin = '11px 0';
            if (blackWhite == false) {
                ll.style.background = '#262626';
                ll.style.color = whiteVar;
            } else {
                ll.style.background = '#FCFCFC';
            }
            ll.style.borderRadius = '10px';
            ll.style.transition = '0.4s';
            ll.style.transform = 'scale(1)';
            ll.style.fontFamily = 'Eurofurence';
            ll.style.fontSize = '20px';
            ll.style.letterSpacing = '0.5px';
            ll.style.verticalAlign = 'middle';
            ll.style.cursor = 'pointer';
            ll.draggable = 'true';
        }
        newDiv.style.fontSize = '14px';
        newDiv.style.wordWrap = 'break-word';
        ulVar.style.width = '100%';
        ulVar.style.paddingLeft = '10px';
        ulVar.style.paddingRight = '10px';
        ulVar.style.paddingBottom = '25px';
        ulVar.style.paddingTop = '25px';
        ulVar.style.boxSizing = 'border-box';

        var sectionColours = ["#E30022", "#FF8B00", "#FEE72F", "#03C03C", "#1F75FE", "#662B7E"]
        var countColours = 0;

        var containerVV = document.querySelector('.tabs-category');
        var h1VV = document.querySelector('.h1V');
        containerVV.insertBefore(newDiv, h1VV);

        var dropzone = document.getElementById('dropzone');
        var nodes = document.getElementsByClassName('node');
        var selectedNode = '';
        var selectedNodePos = 0;
        updateNodes();

        function updateNodes() {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (ev) => {
                    var spanX = (ev.target);
                    if ((spanX.children[0].tagName) == 'IMG') {
                        chrome.tabs.update(tabs[spanX.id].id, { active: true, highlighted: true });
                    }
                });
                nodes[i].children[1].addEventListener('click', (ev) => {
                    var spanX = (ev.target).parentElement.parentElement;
                    var tabNumber = spanX.id;
                    ulVar.removeChild(spanX);
                    if (spanX.title == 'ss') {
                        for (var j = 0; j < tabsDatas.length; j++) {
                            if (spanX.id == tabsDatas[j].id) {
                                tabsDatas.splice(j, 1);
                                tabPosIncrement = 0;
                                for (let z = 0; z < nodes.length; z++) {
                                    if (tabsDatas[z].color == undefined) {
                                        tabsDatas[z].tabPosition = tabPosIncrement;
                                        tabPosIncrement = tabPosIncrement + 1;
                                    }
                                    tabsDatas[z].ulvarPosition = z;
                                }
                                chrome.storage.sync.set({ 'splitzData': tabsDatas }, function () {
                                });
                            }
                        }
                    } else {
                        chrome.tabs.remove(tabs[tabNumber].id, function () { });
                        for (var j = 0; j < tabsDatas.length; j++) {
                            if (spanX.id == tabsDatas[j].id) {
                                var prevtabsN = tabsDatas[0].ntabs;
                                var currtabsN = prevtabsN - 1;
                                for (var t = 0; t < tabsDatas.length; t++) {
                                    tabsDatas[t].ntabs = currtabsN;
                                }
                                tabsDatas.splice(j, 1);
                                tabPosIncrement = 0;
                                for (let z = 0; z < nodes.length; z++) {
                                    if (tabsDatas[z].color == undefined) {
                                        tabsDatas[z].tabPosition = tabPosIncrement;
                                        tabPosIncrement = tabPosIncrement + 1;
                                    }
                                    tabsDatas[z].ulvarPosition = z;
                                }
                                chrome.storage.sync.set({ 'splitzData': tabsDatas }, function () {
                                });
                            }
                        }
                    }
                });
                nodes[i].addEventListener('mouseenter', (ev) => {
                    var spanX = document.getElementById(ev.target.id);
                    spanX.children[1].style.display = 'block';
                });
                nodes[i].addEventListener('mouseleave', (ev) => {
                    var spanX = document.getElementById(ev.target.id);
                    spanX.children[1].style.display = 'none';
                });
                nodes[i].addEventListener('mouseenter', (ev) => {
                    if (blackWhite == false) {
                        document.getElementById(ev.target.id).style.background = '#808080';
                        document.getElementById(ev.target.id).style.color = whiteVar;
                    } else {
                        document.getElementById(ev.target.id).style.color = blackVar;
                        document.getElementById(ev.target.id).style.background = '#dadada';
                    }
                });
                nodes[i].addEventListener('mouseleave', (ev) => {
                    if (blackWhite == false) {
                        document.getElementById(ev.target.id).style.background = '#262626';
                    } else {
                        document.getElementById(ev.target.id).style.background = '#FCFCFC';
                    }
                });
                nodes[i].addEventListener('mouseenter', (ev) => {
                    document.getElementById(ev.target.id).style.transform = 'scale(1.03)';
                });
                nodes[i].addEventListener('mouseleave', (ev) => {
                    document.getElementById(ev.target.id).style.transform = 'scale(1.0)';
                });
                nodes[i].addEventListener('mousedown', (ev) => {
                    var spanX = document.getElementById(ev.target.id);
                    if (spanX != null) spanX.style.backgroundColor = '#bfbfbf';
                });
                nodes[i].addEventListener('dragstart', (ev) => {
                    selectedNode = document.getElementById(ev.target.id);
                    setTimeout(() => {
                        dropzone.removeChild(selectedNode);
                    }, 100);
                });
            }
            updateTabPositionData();
        }

        function updateTabPositionData() {
            var ulvarArray = [];
            for (let i = 0; i < nodes.length; i++) {
                var strToNum = parseInt((nodes[i].id), 10);
                ulvarArray.push(strToNum);
            }
            for (let k = 0; k < nodes.length; k++) {
                for (let l = 0; l < ulvarArray.length; l++) {
                    if (k == ulvarArray[l]) {
                        tabsDatas[k].ulvarPosition = l;
                    }
                }
            }
            chrome.storage.sync.set({ 'splitzData': tabsDatas }, function () {
            });
        }

        dropzone.addEventListener('dragover', (ev) => {
            ev.preventDefault();
            mouseLocation(ev.clientY);
        });

        dropzone.addEventListener('drop', (ev) => {
            ev.preventDefault();
            dropzone.insertBefore(selectedNode, dropzone.children[selectedNodePos]);

            setTimeout(() => {
                if (blackWhite == false) {
                    selectedNode.style.backgroundColor = '#262626';
                } else {
                    selectedNode.style.backgroundColor = '#FCFCFC';
                }
            }, 200);

            var myTabsIdArray = [];
            for (let i = 0; i < nodes.length; i++) {
                var strToNum = parseInt((nodes[i].id), 10);
                if (strToNum < tabs.length) {
                    myTabsIdArray.push(strToNum);
                }
            }

            for (let i = 0; i < tabs.length; i++) {
                for (let j = 0; j < myTabsIdArray.length; j++) {
                    if (i == myTabsIdArray[j]) {
                        tabsDatas[i].tabPosition = j;
                        chrome.tabs.move(tabs[i].id, { index: j });
                    }
                }
                updateTabPositionData();
            }
        });

        function establishNodePositions() {
            for (var i = 0; i < nodes.length; i++) {
                var element = document.getElementById(nodes[i]['id']);
                var position = element.getBoundingClientRect();
                var yTop = position.top;
                var yBottom = position.bottom;
                nodes[i]['yPos'] = yTop + ((yBottom - yTop) / 2);
            }
        }

        function mouseLocation(currentYPos) {
            establishNodePositions();
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i]['yPos'] < currentYPos) {
                    var nodeAbove = document.getElementById(nodes[i]['id']);
                    selectedNodePos = i + 1;
                }
            }

            if (typeof nodeAbove == 'undefined') {
                selectedNodePos = 0;
            }
        }

        submitSectionVar.addEventListener("click", (e) => {
            if (textSectionVar.value === '') {
                alert('No blank values allowed');
            } else {
                e.preventDefault();
                var formData = document.getElementById('sectionText').value;
                document.getElementById('sectionText').value = '';
                var sectionValueString = String(formData);
                var lls = document.createElement('li');
                lls.className = 'node';
                var idNumber = nodes.length;
                lls.id = idNumber;
                var circle = document.createElement('i');
                circle.className = "fa fa-circle";
                circle.style.color = sectionColours[countColours];
                circle.style.fontSize = '14px';
                circle.style.paddingRight = '16px';
                circle.style.paddingLeft = '8px';
                circle.style.paddingTop = '5px';
                lls.appendChild(circle);
                var newDivText = document.createTextNode(sectionValueString);
                lls.appendChild(newDivText);
                var theSpan2 = document.createElement('button');
                theSpan2.className = 'xCloseForm';
                theSpan2.id = idNumber;
                var closeIcon = document.createElement('i');
                closeIcon.className = 'fa fa-close'
                closeIcon.style.fontSize = '18px';
                closeIcon.style.color = sectionColours[countColours];
                theSpan2.appendChild(closeIcon);
                theSpan2.style.background = 'none';
                theSpan2.style.border = 'none';
                theSpan2.style.color = '#323232';
                theSpan2.style.cursor = 'pointer';
                theSpan2.style.position = 'fixed';
                theSpan2.style.left = '88%';
                theSpan2.style.display = 'none';
                lls.appendChild(theSpan2);
                lls.style.display = 'flex';
                lls.style.overflow = 'hidden';
                lls.style.padding = '5px 5px 5px';
                lls.style.margin = '11px 0';
                if (blackWhite == false) {
                    lls.style.background = '#262626';
                    lls.style.color = whiteVar;
                } else {
                    lls.style.background = '#FCFCFC';
                }
                lls.style.borderRadius = '10px';
                lls.style.borderStyle = 'solid';
                lls.style.borderColor = sectionColours[countColours];
                lls.style.transition = '0.4s';
                lls.style.transform = 'scale(1)';
                lls.style.fontFamily = 'EurofurenceBold';
                lls.style.fontSize = '22px';
                lls.style.letterSpacing = '0.5px';
                lls.style.verticalAlign = 'middle';
                lls.style.cursor = 'pointer';
                lls.draggable = 'true';
                ulVar.appendChild(lls);
                var tabproto = new TabData;
                tabproto.title = sectionValueString;
                tabproto.color = sectionColours[countColours];
                tabproto.id = idNumber;
                tabsDatas.push(tabproto);
                updateNodes();
                countColours = countColours + 1;
                if (countColours > 5) countColours = 0;
            }
        });

        function newTabChrome() {
            chrome.tabs.create({ 'url': "chrome://newtab", 'active': true }, function (tab) {
            });
        }

        plusButtonVar.addEventListener("click", newTabChrome);
    });
}