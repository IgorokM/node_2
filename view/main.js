const containerEvents = document.getElementById('container-event');



if (containerEvents) {
    containerEvents.addEventListener('click', hendler);
}

async function hendler(event) {
    const target = event.target;
    if (target && target.tagName === 'BUTTON') {
        const params = { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ answer: target.id }) };
        const data = await fetch('/vote', params);
        console.log(await data.json());
    }
}