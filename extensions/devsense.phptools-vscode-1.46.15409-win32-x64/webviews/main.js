const vscode = acquireVsCodeApi();

window.addEventListener('load', main);
window.addEventListener('message', function (ev) { message(ev.data); });

/**
 * Hook element by id to a function.
 * @param {string} id
 * @param {(this: HTMLElement) => any} fn
 */
function onclick(id, fn) {
    const e = document.getElementById(id);
    if (e && fn) e.addEventListener('click', fn);
}

function main() {

    onclick('btn-activate', function () {
        vscode.postMessage({ command: 'activate' });
    });

    onclick('btn-try', function () {
        vscode.postMessage({ command: 'try' });
    });
    
    onclick('btn-buy', function () {
        vscode.postMessage({ command: 'buy' });
    });

    onclick('btn-changelog', function () {
        vscode.postMessage({ command: 'changelog' });
    })

    onclick('btn-subscribe', function () {
        subscribe();
    })

    Array.prototype.forEach.call(document.getElementsByClassName('btn-buy'), function (el) {
        el.addEventListener('click', function () {
            vscode.postMessage({ command: 'buy' });
        });
    });

    document.getElementById('txt-subscribe').addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            subscribe();
        }
    });

    document.getElementById('shownews').addEventListener('change', function () {
        vscode.postMessage({ command: 'shownews', value: this.checked ? true : false });
    });

    // post "loaded" message
    vscode.postMessage({ command: 'loaded', });
}

/** @param {{command: string, data: any}} e */
function message(e) {
    
    if (!e || !e.command) return;
    
    switch (e.command) {
        case 'l':
            const status = document.getElementById('subtitle');
            status.innerText = e.data.statusText;
            status.classList.remove('hidden');

            // const features = document.getElementById('features');
            // features.innerHTML = e.data.featuresHtml;

            const btnTry = document.getElementById('btn-try');
            const btnBuy = document.getElementById('btn-buy');
            const linkBuy = document.getElementById('buy-link');

            if (e.data.valid) {
                btnTry.classList.add('hidden')
                btnBuy.classList.remove('hidden')                
                linkBuy.classList.add('hidden')
            }
            else {
                btnTry.classList.remove('hidden')
                btnBuy.classList.add('hidden')
                linkBuy.classList.remove('hidden')
            }

            // const activate = document.getElementById('subtitle-activate');
            // const buybtn = document.getElementById('btn-activate');

            // if (e.data.valid) {
            //     activate.classList.add('hidden');
            //     buybtn.classList.add('hidden')
            // }
            // else {
            //     activate.classList.remove('hidden');
            //     buybtn.classList.remove('hidden');
            // }
            break;
    }
}

function subscribe() {
    vscode.postMessage({ command: 'subscribe', email: document.getElementById('txt-subscribe').value });
}
