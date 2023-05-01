var currentUrl = window.location,
    elementDiv,
    bodyElement = document.querySelector('body'),
    elementParagraph = null,
    elementDiv = bodyElement.querySelector('.ionbiz-ticket-sharing-modal'),
    uniqueId;

if (currentUrl.href.includes('.ionbiz.com')) {
    uniqueId = bodyElement.querySelector('.uniqueId');

    if (uniqueId) {
        let ticketId = bodyElement.querySelector('#TabGeneral_IssueDetailSection_IssueId'),
            ticketTitle = bodyElement.querySelector('#TabGeneral_IssueDetailSection_Name'),
            ticketIndex = bodyElement.querySelector('#Id');

        if (ticketId && ticketTitle && ticketIndex) {
            let formattedContent = '';
            const ticketURL = 'https://' + currentUrl.hostname + '/Issue/Index/' + ticketIndex.value,
                ticketInfo = ticketId.value + ' ' + ticketTitle.value;

            chrome.storage.sync.get({ 'options': { URL: true } })
                .then((result) => {
                    if (result.options.LINK) {
                        formattedContent = [new ClipboardItem({ "text/html": new Blob(["<a target='_blank' href='" + ticketURL + "'>" + ticketInfo + "</a>"], { type: "text/html" }) })];
                    } else if (result.options.TEXT) {
                        formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketInfo], { type: "text/plain" }) })];
                    } else if (result.options.TEXT_AND_URL) {
                        formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketInfo + ' ' + ticketURL], { type: "text/plain" }) })];
                    } else {
                        formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketURL], { type: "text/plain" }) })];
                    }

                    navigator.clipboard.write(formattedContent).then(function () {
                        window.history.pushState({}, ticketInfo, ticketURL);
                        displayMessage('Ticket info was successfully copied to your clipboard.');
                    }, function (error) {
                        displayMessage('The extension could not write ticket info to the clipboard.', error);
                    });
                })
                .catch((error) => {
                    displayMessage('The extension could not load the saved user preferences.');
                });
        } else {
            displayMessage('The extension could not retrieve the data in the web page.');
        }
    } else {
        displayMessage('View a ticket detail to use the extension.');
    }
} else {
    displayMessage('Go to an Ionbiz subdomain url (*.ionbiz.com) to use the extension.');
}

function displayMessage(message) {
    if (elementDiv) {
        elementParagraph = elementDiv.querySelector('p');
    } else {
        elementDiv = document.createElement('div');
        elementParagraph = document.createElement('p');
        elementDiv.setAttribute('class', 'ionbiz-ticket-sharing-modal');
    }

    elementParagraph.innerHTML = message;
    elementDiv.appendChild(elementParagraph);
    bodyElement.appendChild(elementDiv);
}