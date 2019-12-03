const containerEvents = document.getElementById('container-event');

const params = {
    headers: {
        'Content-Type': 'application/json'
    },
    method: 'POST',
    body: null
};

if (containerEvents) containerEvents.addEventListener('click', handler);

async function handler(event) {
    const target = event.target;
    if (target && target.tagName === 'BUTTON') {
        try {
            if (target.id === 'karl' || target.id === 'marks') {
                params.body = JSON.stringify({
                    answer: target.id
                });
                let data = await fetch('/vote', params);
                data = await data.json();
                if (data.hasOwnProperty('result') && data.result) alert('Ваш голос принят');
            }
            let data = await fetch('/stat', params);
            data = await data.json();
            if (Array.isArray(data)) {
                for (let obj of data) {
                    let progress = document.getElementById(`${obj.name}-progress`);
                    if (progress) {
                        progress.value = obj.count;
                    }
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }
}

(async function () {
    try {
        const actionsTag = document.getElementById('actions');
        const container = [];

        let data = await fetch('/variants');
        data = await data.json();
        if (Array.isArray(data)) {
            for (let variant of data) {
                let button = document.createElement('button');
                button.className = 'btn btn-info';
                button.id = variant.name;
                if (variant.name === 'karl') {
                    button.textContent = 'Карл';
                } else {
                    button.textContent = 'Маркс';
                }
                container.push(button);
            }
            actionsTag.append(...container);
        }
        data = null;

        data = await fetch('/stat', params);
        data = await data.json();
        if (Array.isArray(data)) {
            for (let stat of data) {
                let progress = document.getElementById(`${stat.name}-progress`);
                if (progress) {
                    progress.value = stat.count;
                }
            }
        }
    } catch (e) {
        console.error(e.message);
    }
})()