const containerEvents = document.getElementById('container-event');

if (containerEvents) containerEvents.addEventListener('click', hendler);

async function hendler(event) {
    const target = event.target;
    if (target && target.tagName === 'BUTTON') {
        const params = { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: null };
        try {
            if (target.id === '1' || target.id === '2') {
                params.body = JSON.stringify({ answer: target.id });
                let data = await fetch('/vote', params);
                data = await data.json();
                if (data.hasOwnProperty('result') && data.result) alert('Ваш голос принят');
            } else if (target.id === 'stat') {
                let data = await fetch('/stat', params);
                data = await data.json();
                if (Array.isArray(data)) {
                    for (let obj of data) {
                        let progress = document.getElementById(obj.name);
                        if (progress) {
                            progress.value = obj.count;
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }
}